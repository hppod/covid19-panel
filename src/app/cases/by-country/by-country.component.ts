import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from "rxjs"
import { APIService } from "./../../services/api.service"
import { CasoFull } from "./../../models/caso_full.model"
import { PoModalComponent, PoTableColumn, PoPieChartSeries, PoChartType } from '@po-ui/ng-components';
import { Caso } from 'src/app/models/caso.model';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-by-country',
  templateUrl: './by-country.component.html',
  styleUrls: ['./by-country.component.css']
})
export class ByCountryComponent implements OnInit, OnDestroy {



  request: Subscription
  isLoading: boolean
  Data: CasoFull[] = new Array()
  titleDetailsModal: string
  itemsDetails: Array<any> = new Array()
  itemsCasesDetails: Array<any> = new Array()
  itemsDeathsDetails: Array<any> = new Array()
  numberOfCases: number
  numberOfDeaths: number
  numberOfNewCases: number
  numberOfNewDeaths: number
  totalCounties: number
  totalCountiesWithCases: number
  totalCountiesWithDeaths: number
  populationBrazil: number
  public lineChartData: ChartDataSets[] = []
  public lineChartLabels: Label[] = new Array()
  public lineChartLegend = true
  public lineChartType = 'line'
  public lineChartPlugins = []

  public lineChartOptions: ChartOptions = {
    responsive: true
  }

  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(76,94,98,0.3)'
    }
  ]

  newCasesPerStateType: PoChartType = PoChartType.Donut
  newCasesPerStateData: Array<PoPieChartSeries> = new Array()

  // coffeeConsumption: Array<PoPieChartSeries> = [
  //   { category: 'Brazil', value: 2796, tooltip: 'Brazil (South America)' },
  //   { category: 'Vietnam', value: 1076, tooltip: 'Vietnam (Asia)' },
  //   { category: 'Colombia', value: 688, tooltip: 'Colombia (South America)' },
  //   { category: 'Indonesia', value: 682, tooltip: 'Indonesia (Asia/Oceania)' },
  //   { category: 'Vietnam', value: 645, tooltip: 'Vietnam (Asia)' },
  //   { category: 'Peru', value: 154, tooltip: 'Peru (South America)' }
  // ]

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
    this.isLoading = true
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.Data = response.body['results']
      this.numberOfCases = this.calculateCases(this.Data)
      this.numberOfDeaths = this.calculateDeaths(this.Data)
      this.numberOfNewCases = this.calculateNewCases(this.Data)
      this.numberOfNewDeaths = this.calculateNewDeaths(this.Data)
      this.itemsCasesDetails = this.setCasesDetails(this.Data)
      this.itemsDeathsDetails = this.setDeathsDetails(this.Data)
      this.isLoading = false
    }, err => {
      this.isLoading = false
    })
  }

  getDataCasos() {
    this._service.params = this._service.params.set('place_type', 'city')
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.totalCountiesWithCases = response.body['count']
      this.getDataDeaths()
      this.isLoading = false
    }, err => {
      this.isLoading = false
    })
  }

  getDataCasosEpidemiologicalCurve() {
    this._service.params = this._service.params.set('place_type', 'state')
    this._service.params = this._service.params.set('is_last', 'False')
    this._service.params = this._service.params.set('page_size', '10000')
    this.request = this._service.getDataCasosFull().subscribe(response => {
      this.getDataLineChartEpidemiologicalCurve(response.body['results'])
      this.isLoading = false
    }, err => {
      this.isLoading = false
    })
  }

  getDataDeaths() {
    this._service.params = this._service.params.delete('had_cases')
    this._service.params = this._service.params.append('page_size', '10000')
    this.request = this._service.getDataCasos().subscribe(response => {
      this.totalCountiesWithDeaths = this.calculateDeathsOnCounties(response.body['results'])
      this.populationBrazil = this.calculatePopulation(response.body['results'])
      this.getDataCasosEpidemiologicalCurve()
      this.isLoading = false
    }, err => {
      this.isLoading = false
    })
  }

  getDataCounties() {
    this.isLoading = true
    this.request = this._service.getCounties().subscribe(response => {
      this.Data = response.body
      this.totalCounties = this.Data.length
      this.getDataCasos()
    }, err => {
      this.isLoading = false
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
    let newCases = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i]['is_last']) {
        newCases = newCases + data[i]['new_confirmed']
      }
    }
    return newCases
  }

  calculateNewDeaths(data: CasoFull[]): number {
    let newDeaths = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i]['is_last']) {
        newDeaths = newDeaths + data[i]['new_deaths']
      }
    }
    return newDeaths
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

  calculatePopulation(data: Caso[]): number {
    let population = 0
    for (let i = 0; i < data.length; i++) {
      population = population + data[i]['estimated_population_2019']
    }
    return population
  }

  getDataLineChartEpidemiologicalCurve(data: CasoFull[]) {
    let cases: number = 0
    let casesData: number[] = new Array()
    for (let i = data.length - 1; i > -1; i--) {
      this.lineChartLabels.push(data[i]['last_available_date'])
      cases = cases + data[i]['new_confirmed']
      casesData.push(cases)
    }
    this.lineChartData = [{
      data: casesData,
      label: 'Nº de casos por data'
    }]
  }

  openModal(type) {
    switch (type) {
      case 'cases':
        this.titleDetailsModal = 'Novos casos - Detalhes'
        this.itemsDetails = this.itemsCasesDetails
        this.detailsModalElement.open()
        break;
      case 'deaths':
        this.titleDetailsModal = 'Novas Mortes - Detalhes'
        this.itemsDetails = this.itemsDeathsDetails
        this.detailsModalElement.open()
        break;
    }
  }

}
