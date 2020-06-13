import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { APIService } from "../../services/api.service"
import { CasoFull } from "../../models/caso_full.model"
import { PoTableColumn, PoChartType, PoPieChartSeries, PoTableLiterals, PoTableAction, PoModalComponent } from '@po-ui/ng-components';
import { ExtractNewDataPerState } from 'src/app/functions/utils';
import { GoogleChartInterface, ChartErrorEvent } from "ng2-google-charts"
import { HttpParams } from '@angular/common/http';

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
  Data: CasoFull[] = new Array()
  DataDetails: CasoFull[] = new Array()
  actions: PoTableAction[] = [
    { 'label': 'Ver detalhes', 'action': this.openModal.bind(this) }
  ]

  ChartTypeDonut: PoChartType = PoChartType.Donut
  newCasesPerStateData: Array<PoPieChartSeries> = new Array()
  newDeathsPerStateData: Array<PoPieChartSeries> = new Array()

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

  error(event: ChartErrorEvent) {
    return 'Erro ao carregar o gráfico, tente novamente mais tarde'
  }

  openModal(row: CasoFull) {
    this.titleModalDetails = `Dados por estado - ${row['state']}`

    this.getDataCasosDetailsRequest(row['state'])

    this.poModal.open()
  }

}
