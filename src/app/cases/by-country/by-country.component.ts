import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from "rxjs"
import { APIService } from "./../../services/api.service"
import { CasoFull } from "./../../models/caso_full.model"
import { PoModalComponent, PoTableColumn, PoPieChartSeries, PoChartType } from '@po-ui/ng-components';
import { Caso } from 'src/app/models/caso.model';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from "@angular/common"

@Component({
  selector: 'app-by-country',
  templateUrl: './by-country.component.html',
  styleUrls: ['./by-country.component.css']
})
export class ByCountryComponent implements OnInit, OnDestroy {

  today: string = formatDate(new Date().toString(), 'yyyy-MM-dd', 'pt-BR')
  request: Subscription
  statusResponse: number
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
  populationBrazil: number = 0

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

  newCasesPerStateType: PoChartType = PoChartType.Donut
  newCasesPerStateData: Array<PoPieChartSeries> = new Array()

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
  ) { }

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
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.Data = response.body['results']
      this.dateOfData = response.body['results'][0]['date']
      this.numberOfCases = this.calculateCases(this.Data)
      this.numberOfDeaths = this.calculateDeaths(this.Data)
      this.numberOfNewCases = this.calculateNewCases(this.Data)
      this.numberOfNewDeaths = this.calculateNewDeaths(this.Data)
      this.itemsCasesDetails = this.setCasesDetails(this.Data)
      this.itemsDeathsDetails = this.setDeathsDetails(this.Data)
      this.newCasesPerStateData = this.setNewCasesByState(this.Data)
    }, err => {
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
      this.populationBrazil = this.calculatePopulation(response.body['results'])
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

  calculateCases(data: CasoFull[]): number {
    let cases = 0
    for (let i = 0; i < data.length; i++) {
      cases = cases + data[i]['last_available_confirmed']
    }
    return cases
  }

  calculateDeaths(data: CasoFull[]): number {
    let deaths = 0
    for (let i = 0; i < data.length; i++) {
      deaths = deaths + data[i]['last_available_deaths']
    }
    return deaths
  }

  calculateNewCases(data: CasoFull[]): number {
    let new_cases: any = new Array()
    let sum: number = 0

    let cases = data.reduce((obj, { date, new_confirmed }) => {
      if (!obj[date]) {
        obj[date] = new Array()
      }
      sum = sum + new_confirmed
      obj[date].push(sum)
      return obj
    }, {})

    Object.keys(cases).forEach(function (item) {
      new_cases.push(cases[item])
    })

    return new_cases[0][new_cases[0].length - 1]
  }

  calculateNewDeaths(data: CasoFull[]): number {
    let new_deaths: any = new Array()
    let sum: number = 0

    let cases = data.reduce((obj, { date, new_deaths }) => {
      if (!obj[date]) {
        obj[date] = new Array()
      }
      sum = sum + new_deaths
      obj[date].push(sum)
      return obj
    }, {})

    Object.keys(cases).forEach(function (item) {
      new_deaths.push(cases[item])
    })

    return new_deaths[0][new_deaths[0].length - 1]
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

  setNewCasesByState(data: CasoFull[]): Array<PoPieChartSeries> {
    let casesByState: PoPieChartSeries[] = new Array()
    let top: PoPieChartSeries[] = new Array()
    for (let i = 0; i < data.length; i++) {
      casesByState.push({
        category: data[i]['state'],
        value: data[i]['new_confirmed']
      })
    }
    top = casesByState.sort((a, b) => b.value - a.value).slice(0, 8)
    return top
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

  calculatePopulation(data: Caso[]): number {
    let population = 0
    for (let i = 0; i < data.length; i++) {
      population = population + data[i]['estimated_population_2019']
    }
    return population
  }

  getDataLineChartAcumulatedCases(data: CasoFull[]) {
    let new_cases: number = 0
    let casesData: number[] = new Array()

    let cases = data.reduce(function (curValue, curIndex) {
      let found: boolean = false
      for (let item of curValue) {
        if (item['date'] == curIndex['date']) {
          item['new_confirmed'] += curIndex['new_confirmed']
          found = true
          break
        }
      }
      if (!found) {
        curValue.push(curIndex)
      }
      return curValue
    }, [])

    for (let i = cases.length - 1; i > -1; i--) {
      this.LineChartDataAcumulatedCasesLabels.push(cases[i]['date'])
      new_cases = new_cases + cases[i]['new_confirmed']
      casesData.push(new_cases)
    }

    this.LineChartDataAcumulatedCasesDataset = [{
      data: casesData,
      label: 'Nº de casos por dia'
    }]
  }

  getDataLineChartAcumulatedDeaths(data: CasoFull[]) {
    let new_deaths: number = 0
    let deathsData: number[] = new Array()

    let deaths = data.reduce(function (curValue, curIndex) {
      let found: boolean = false
      for (let item of curValue) {
        if (item['date'] == curIndex['date']) {
          item['new_deaths'] += curIndex['new_deaths']
          found = true
          break
        }
      }
      if (!found) {
        curValue.push(curIndex)
      }
      return curValue
    }, [])

    for (let i = deaths.length - 1; i > -1; i--) {
      this.LineChartDataAcumulatedDeathsLabels.push(deaths[i]['date'])
      new_deaths = new_deaths + deaths[i]['new_deaths']
      deathsData.push(new_deaths)
    }

    this.LineChartDataAcumulatedDeathsDataset = [{
      data: deathsData,
      label: 'Nº de mortes por dia'
    }]
  }

  getDataBarChartNewCases(data: CasoFull[]) {
    let new_cases: number[] = new Array()
    let dates: string[] = new Array()

    let cases = data.reduce((obj, { date, new_confirmed }) => {
      if (!obj[date]) {
        obj[date] = new Array()
      }
      obj[date].push(new_confirmed)
      return obj
    }, {})

    Object.keys(cases).forEach(function (item) {
      dates.push(item)
      new_cases.push(cases[item][0])
    })

    this.BarChartDataNewCasesLabels = dates.reverse()
    this.BarChartDataNewCasesDataset = [{
      data: new_cases.reverse(),
      label: 'Nº de novos casos por dia'
    }]
  }

  getDataBarChartNewDeaths(data: CasoFull[]) {
    let new_deaths: number[] = new Array()
    let dates: string[] = new Array()

    let deaths = data.reduce((obj, { date, new_deaths }) => {
      if (!obj[date]) {
        obj[date] = new Array()
      }
      obj[date].push(new_deaths)
      return obj
    }, {})

    Object.keys(deaths).forEach(function (item) {
      dates.push(item)
      new_deaths.push(deaths[item][0])
    })

    this.BarChartDataNewDeathsLabels = dates.reverse()
    this.BarChartDataNewDeathsDataset = [{
      data: new_deaths.reverse(),
      label: 'Nº de novas mortes por dia'
    }]
  }

  openModal(type) {
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
