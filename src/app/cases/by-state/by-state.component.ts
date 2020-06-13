import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { APIService } from "../../services/api.service"
import { CasoFull } from "../../models/caso_full.model"
import { PoTableColumn, PoChartType, PoPieChartSeries, PoTableLiterals, PoTableAction, PoModalComponent } from '@po-ui/ng-components';
import { ExtractNewDataPerState } from 'src/app/functions/utils';
import { GoogleChartInterface, ChartErrorEvent } from "ng2-google-charts"
import { HttpParams } from '@angular/common/http'
import { CalculateNew, ExtractNewData } from "./../../functions/utils"
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-by-state',
  templateUrl: './by-state.component.html',
  styleUrls: ['./by-state.component.css']
})
export class ByStateComponent implements OnInit, OnDestroy {

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent

  limit: number = 30
  statusResponse: number
  request: Subscription
  isLoading: boolean
  isLoadingDetails: boolean
  titleModalDetails: string
  dateDetails: string
  titleNewCasesDetails: string
  titleNewDeathsDetails: string
  Data: CasoFull[] = new Array()
  DataDetails: CasoFull[] = new Array()
  actions: PoTableAction[] = [
    { 'label': 'Ver detalhes', 'action': this.openModal.bind(this) }
  ]

  ChartTypeDonut: PoChartType = PoChartType.Donut
  newCasesPerStateData: Array<PoPieChartSeries> = new Array()
  newDeathsPerStateData: Array<PoPieChartSeries> = new Array()
  numberOfCases: number = 0
  numberOfNewCases: number = 0
  numberOfDeaths: number = 0
  numberOfNewDeaths: number = 0

  constructor(
    private _router: Router,
    private _service: APIService,
  ) {
    this._service.params = new HttpParams()
  }

  public readonly customLiterals: PoTableLiterals =
    {
      'noData': 'Sem dados a serem exibidos',
      'loadingData': 'Carregando'
    }

  public readonly columnsDetails: Array<PoTableColumn> = [
    { property: 'last_available_date', label: 'Data', type: 'date' },
    { property: 'state', label: 'Estado', type: 'string' },
    { property: 'last_available_confirmed', label: 'Casos', type: 'number' },
    { property: 'new_confirmed', label: 'Novos casos', type: 'number' },
    { property: 'last_available_deaths', label: 'Mortes', type: 'number' },
    { property: 'new_deaths', label: 'Novas mortes', type: 'number' }
  ];

  public geoChartCases: GoogleChartInterface = {
    chartType: 'GeoChart',
    options: {
      'region': 'BR',
      'resolution': 'provinces',
      'displayMode': 'regions',
      'colorAxis': {}
    }
  }

  public geoChartDeaths: GoogleChartInterface = {
    chartType: 'GeoChart',
    options: {
      'region': 'BR',
      'resolution': 'provinces',
      'displayMode': 'regions',
      'colorAxis': {}
    }
  }

  /**Options charts */
  public BarChartType = 'bar'
  public ChartLegend = true
  public ChartPlugins = []
  public ChartOptions: ChartOptions = {
    responsive: true
  }

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

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    this._service.params = this._service.params.set('had_cases', 'True')
    this._service.params = this._service.params.set('is_last', 'True')
    this._service.params = this._service.params.set('place_type', 'state')
    this.getDataCasosRequest()
  }

  ngOnDestroy(): void {
    this.request.unsubscribe()
  }

  getDataCasosRequest() {
    this.isLoading = true
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.Data = response.body['results']
      this.newCasesPerStateData = ExtractNewDataPerState(this.Data, 'new_confirmed', 8)
      this.newDeathsPerStateData = ExtractNewDataPerState(this.Data, 'new_deaths', 8)
      this.geoChartCases.dataTable = this.getDataGeoChart(this.Data, 'cases')
      this.geoChartDeaths.dataTable = this.getDataGeoChart(this.Data, 'deaths')
      this.statusResponse = 200
      this.isLoading = false
    }, err => {
      this.statusResponse = 500
      this.isLoading = false
    })
  }

  getDataCasosDetailsRequest(stateDetails: string) {
    this.isLoadingDetails = true
    this._service.params = this._service.params.delete('is_last')
    this._service.params = this._service.params.set('state', stateDetails)
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.DataDetails = response.body['results']
      this.dateDetails = this.DataDetails[0]['date']
      this.getDataBarChartNewCases(this.DataDetails)
      this.getDataBarChartNewDeaths(this.DataDetails)
      this.numberOfCases = this.DataDetails[0]['last_available_confirmed']
      this.numberOfDeaths = this.DataDetails[0]['last_available_deaths']
      this.numberOfNewCases = CalculateNew(this.DataDetails, 'new_confirmed')
      this.numberOfNewDeaths = CalculateNew(this.DataDetails, 'new_deaths')
      console.log(this.DataDetails)
      this.statusResponse = 200
      this.isLoadingDetails = false
    }, err => {
      this.statusResponse = 500
      this.isLoadingDetails = false
    })
  }

  getDataGeoChart(data: CasoFull[], ChartType: string) {
    let geoChartData = new Array()

    if (ChartType == 'cases') {
      this.geoChartCases.options['colorAxis'] = { colors: ['#b3f4ff', '#008299'] }
      geoChartData.push(['Estado', 'Nº de casos'])
      data.forEach(element => {
        geoChartData.push([
          `BR-${element['state']}`, element['last_available_confirmed']
        ])
      })
    } else {
      this.geoChartDeaths.options['colorAxis'] = { colors: ['#ffcccc', '#b30000'] }
      geoChartData.push(['Estado', 'Nº de mortes'])
      data.forEach(element => {
        geoChartData.push([
          `BR-${element['state']}`, element['last_available_deaths']
        ])
      })
    }

    return geoChartData
  }

  /**GeoChart */
  error(event: ChartErrorEvent) {
    return 'Erro ao carregar o gráfico, tente novamente mais tarde'
  }

  openModal(row: CasoFull) {
    this.titleModalDetails = `Dados por estado - ${row['state']}`
    this.titleNewCasesDetails = `Número de novos casos - ${row['state']}`
    this.titleNewDeathsDetails = `Número de novas mortes - ${row['state']}`

    this.getDataCasosDetailsRequest(row['state'])

    this.poModal.open()
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

}
