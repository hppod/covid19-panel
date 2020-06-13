import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from "rxjs"
import { APIService } from "./../../services/api.service"
import { CasoFull } from "./../../models/caso_full.model"
import { PoModalComponent, PoTableColumn, PoPieChartSeries, PoChartType, PoTableLiterals } from '@po-ui/ng-components';
import { Caso } from 'src/app/models/caso.model';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ExtractAccumulatedData, ExtractNewData, CalculateNewData } from 'src/app/functions/utils';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-by-country',
  templateUrl: './by-country.component.html',
  styleUrls: ['./by-country.component.css']
})
export class ByCountryComponent implements OnInit, OnDestroy {

  request: Subscription
  statusResponse: number
  isLoading: boolean = false
  Data: CasoFull[] = new Array()
  dateOfData: string
  titleDetailsModal: string
  itemsDetails: Array<any> = new Array()
  itemsCasesDetails: Array<any> = new Array()
  itemsDeathsDetails: Array<any> = new Array()
  numberOfCases: number = 0
  numberOfDeaths: number = 0
  numberOfNewCases: number = 0
  numberOfNewDeaths: number = 0
  totalCounties: number = 0
  totalCountiesWithCases: number = 0
  totalCountiesWithDeaths: number = 0
  customLiterals: PoTableLiterals = { 'noData': 'Sem dados a serem exibidos', 'loadingData': 'Carregando' }

  /**Options charts */
  public LineChartType = 'line'
  public BarChartType = 'bar'
  public ChartLegend = true
  public ChartPlugins = []
  public ChartOptions: ChartOptions = {
    responsive: true
  }

  /**Line chart acumulated cases */
  public LineChartDataAcumulatedCasesDataset: ChartDataSets[] = []
  public LineChartDataAcumulatedCasesLabels: Label[] = new Array()
  public LineChartDataAcumulatedCasesColors: Color[] = [
    {
      borderColor: 'rgb(0,0,255)',
      backgroundColor: 'rgba(0,0,255,0.3)'
    }
  ]

  /**Line chart acumulated deaths */
  public LineChartDataAcumulatedDeathsDataset: ChartDataSets[] = []
  public LineChartDataAcumulatedDeathsLabels: Label[] = new Array()
  public LineChartDataAcumulatedDeathsColors: Color[] = [
    {
      borderColor: 'rgb(255,0,0)',
      backgroundColor: 'rgba(255,0,0,0.3)'
    }
  ]

  /**Bar chart new cases */
  public BarChartDataNewCasesDataset: ChartDataSets[] = []
  public BarChartDataNewCasesLabels: Label[] = new Array()
  public BarChartDataNewCasesColors: Color[] = [
    {
      backgroundColor: 'rgb(0,0,255)',
    }
  ]

  /**Bar chart new deaths */
  public BarChartDataNewDeathsDataset: ChartDataSets[] = []
  public BarChartDataNewDeathsLabels: Label[] = new Array()
  public BarChartDataNewDeathsColors: Color[] = [
    {
      backgroundColor: 'rgb(255,0,0)',
    }
  ]

  @ViewChild('detailsModal', { static: true }) detailsModalElement: PoModalComponent

  public readonly columnsDetails: Array<PoTableColumn> = [
    { property: 'last_available_date', label: 'Data', type: 'date' },
    { property: 'state', label: 'Estado', type: 'string' },
    { property: 'last_confirmed', label: 'Dados anteriores', type: 'number' },
    { property: 'new', label: 'Novos números', type: 'number' },
    { property: 'total', label: 'Total', type: 'number' }
  ];

  constructor(
    private _router: Router,
    private _service: APIService
  ) {
    this._service.params = new HttpParams()
  }

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    this._service.params = this._service.params.append('had_cases', 'True')
    this._service.params = this._service.params.append('is_last', 'True')
    this._service.params = this._service.params.append('place_type', 'state')
    this.getDataCasosFull()
    this.getDataCounties()
  }

  ngOnDestroy(): void {
    this.request.unsubscribe()
  }

  getDataCasosFull() {
    this.isLoading = true
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.Data = response.body['results']
      this.dateOfData = response.body['results'][0]['date']
      this.numberOfCases = this.calculateCases(this.Data)
      this.numberOfDeaths = this.calculateDeaths(this.Data)
      this.numberOfNewCases = this.calculateNewCases(this.Data)
      this.numberOfNewDeaths = this.calculateNewDeaths(this.Data)
      this.itemsCasesDetails = this.setCasesDetails(this.Data)
      this.itemsDeathsDetails = this.setDeathsDetails(this.Data)
      this.isLoading = false
    }, err => {
      this.statusResponse = 500
      this.isLoading = false
    })
  }

  getDataCasos() {
    this._service.params = this._service.params.set('place_type', 'city')
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.totalCountiesWithCases = response.body['count']
      this.statusResponse = response.status
      this.getDataDeaths()
    }, err => {
      this.statusResponse = 500
    })
  }

  getDataCasosEpidemiologicalCurve() {
    this._service.params = this._service.params.set('place_type', 'state')
    this._service.params = this._service.params.delete('is_last')
    this._service.params = this._service.params.set('page_size', '10000')
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.getDataLineChartAcumulatedCases(response.body['results'])
      this.getDataLineChartAcumulatedDeaths(response.body['results'])
      this.getDataBarChartNewCases(response.body['results'])
      this.getDataBarChartNewDeaths(response.body['results'])
    }, err => {
    })
  }

  getDataDeaths() {
    this._service.params = this._service.params.delete('had_cases')
    this._service.params = this._service.params.append('page_size', '10000')
    this.request = this._service.getDataCasos().subscribe(response => {
      this.totalCountiesWithDeaths = this.calculateDeathsOnCounties(response.body['results'])
      this.getDataCasosEpidemiologicalCurve()
    }, err => {
    })
  }

  getDataCounties() {
    this.request = this._service.getCounties().subscribe(response => {
      this.Data = response.body
      this.totalCounties = this.Data.length
      this.getDataCasos()
    }, err => {
    })
  }

  /**
    * Totaliza o número de casos desde o início da pandemia
    * @param data Recebe os dados vindos da requisição feita a API
    */
  calculateCases(data: CasoFull[]): number {
    let cases = 0
    for (let i = 0; i < data.length; i++) {
      cases = cases + data[i]['last_available_confirmed']
    }
    return cases
  }

  /**
   * Totaliza o número de mortes desde o início da pandemia
   * @param data Recebe os dados vindos da requisição feita a API
   */
  calculateDeaths(data: CasoFull[]): number {
    let deaths = 0
    for (let i = 0; i < data.length; i++) {
      deaths = deaths + data[i]['last_available_deaths']
    }
    return deaths
  }

  /**
   * Extrai os dados de novos casos em relação ao dia anterior
   * @param data Recebe os dados vindos da requisição feita a API
   */
  calculateNewCases(data: CasoFull[]): number {
    let sumNewCases: any = new Array()
    let cases = CalculateNewData(data, 'new_confirmed')

    Object.keys(cases).forEach(function (item) {
      sumNewCases.push(cases[item])
    })

    return sumNewCases[0][sumNewCases[0].length - 1]
  }

  /**
     * Extrai os dados de novas mortes em relação ao dia anterior
     * @param data Recebe os dados vindos da requisição feita a API
     */
  calculateNewDeaths(data: CasoFull[]): number {
    let sumNewDeaths: any = new Array()
    let cases = CalculateNewData(data, 'new_deaths')

    Object.keys(cases).forEach(function (item) {
      sumNewDeaths.push(cases[item])
    })

    return sumNewDeaths[0][sumNewDeaths[0].length - 1]
  }

  calculateDeathsOnCounties(data: Caso[]): number {
    let countiesWithDeaths = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i]['deaths'] > 0) {
        countiesWithDeaths = countiesWithDeaths + 1
      }
    }
    return countiesWithDeaths
  }

  setCasesDetails(data: CasoFull[]): any[] {
    let caseDetails: any[] = new Array
    for (let i = 0; i < data.length; i++) {
      caseDetails.push({
        last_available_date: data[i]['last_available_date'],
        state: data[i]['state'],
        last_confirmed: data[i]['last_available_confirmed'],
        new: data[i]['new_confirmed'],
        total: data[i]['last_available_confirmed'] + data[i]['new_confirmed']
      })
    }
    return caseDetails
  }

  setDeathsDetails(data: CasoFull[]): any[] {
    let deathsDetails: any[] = new Array
    for (let i = 0; i < data.length; i++) {
      deathsDetails.push({
        last_available_date: data[i]['last_available_date'],
        state: data[i]['state'],
        last_confirmed: data[i]['last_available_deaths'],
        new: data[i]['new_deaths'],
        total: data[i]['last_available_deaths'] + data[i]['new_deaths']
      })
    }
    return deathsDetails
  }

  /**
   * Extrai os dados de casos acumulados por dia e atribui-os aos sets do gráfico de linhas
   * @param data Recebe os dados vindos da requisição feita a API
   */
  getDataLineChartAcumulatedCases(data: CasoFull[]) {
    let DatasetChart: number[] = new Array()
    let accumulatedCasesSum: number = 0
    let cases: CasoFull[] = ExtractAccumulatedData(data, 'new_confirmed')

    for (let i = cases.length - 1; i > -1; i--) {
      this.LineChartDataAcumulatedCasesLabels.push(cases[i]['date'])
      accumulatedCasesSum = accumulatedCasesSum + cases[i]['new_confirmed']
      DatasetChart.push(accumulatedCasesSum)
    }

    this.LineChartDataAcumulatedCasesDataset = [{
      data: DatasetChart,
      label: 'Nº de casos por dia'
    }]
  }

  /**
   * Extrai os dados de mortes acumuladas por dia e atribui-os aos sets do gráfico de linhas
   * @param data Recebe os dados vindos da requisição feita a API
   */
  getDataLineChartAcumulatedDeaths(data: CasoFull[]) {
    let DatasetChart: number[] = new Array()
    let accumulatedDeathsSum: number = 0
    let deaths: CasoFull[] = ExtractAccumulatedData(data, 'new_deaths')

    for (let i = deaths.length - 1; i > -1; i--) {
      this.LineChartDataAcumulatedDeathsLabels.push(deaths[i]['date'])
      accumulatedDeathsSum = accumulatedDeathsSum + deaths[i]['new_deaths']
      DatasetChart.push(accumulatedDeathsSum)
    }

    this.LineChartDataAcumulatedDeathsDataset = [{
      data: DatasetChart,
      label: 'Nº de mortes por dia'
    }]
  }

  /**
   * Extrai os dados de novos casos por dia e atribui-os aos sets do gráfico de barras
   * @param data Recebe os dados vindos da requisição feita a API
   */
  getDataBarChartNewCases(data: CasoFull[]) {
    let newCasesPerDay: number[] = new Array()
    let datesNewCases: string[] = new Array()
    let cases = ExtractNewData(data, 'new_confirmed')

    Object.keys(cases).forEach(function (item) {
      datesNewCases.push(item)
      newCasesPerDay.push(cases[item][0])
    })

    this.BarChartDataNewCasesLabels = datesNewCases.reverse()
    this.BarChartDataNewCasesDataset = [{
      data: newCasesPerDay.reverse(),
      label: 'Nº de novos casos por dia'
    }]
  }

  /**
   * Extrai os dados de novas mortes por dia e atribui-os aos sets do gráfico de barras
   * @param data Recebe os dados vindos da requisição feita a API
   */
  getDataBarChartNewDeaths(data: CasoFull[]) {
    let newDeathsPerDay: number[] = new Array()
    let datesNewDeaths: string[] = new Array()
    let deaths = ExtractNewData(data, 'new_deaths')

    Object.keys(deaths).forEach(function (item) {
      datesNewDeaths.push(item)
      newDeathsPerDay.push(deaths[item][0])
    })

    this.BarChartDataNewDeathsLabels = datesNewDeaths.reverse()
    this.BarChartDataNewDeathsDataset = [{
      data: newDeathsPerDay.reverse(),
      label: 'Nº de novas mortes por dia'
    }]
  }

  /**
   * Atribui as propriedades do modal e abre ele
   * @param type Recebe o tipo de modal que deve ser aberto
   */
  openModal(type: String) {
    switch (type) {
      case 'cases':
        this.titleDetailsModal = 'Casos - Detalhes'
        this.itemsDetails = this.itemsCasesDetails
        this.detailsModalElement.open()
        break;
      case 'deaths':
        this.titleDetailsModal = 'Mortes - Detalhes'
        this.itemsDetails = this.itemsDeathsDetails
        this.detailsModalElement.open()
        break;
    }
  }

}
