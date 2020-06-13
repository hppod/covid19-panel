import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { APIService } from "../../services/api.service"
import { CasoFull } from "../../models/caso_full.model"
import { PoTableColumn, PoChartType, PoPieChartSeries } from '@po-ui/ng-components';
import { ExtractNewDataPerState } from 'src/app/functions/utils';

@Component({
  selector: 'app-by-state',
  templateUrl: './by-state.component.html',
  styleUrls: ['./by-state.component.css']
})
export class ByStateComponent implements OnInit, OnDestroy {

  limit: number = 30
  statusResponse: number
  request: Subscription
  isLoading: boolean
  Data: CasoFull[] = new Array()

  ChartTypeDonut: PoChartType = PoChartType.Donut
  newCasesPerStateData: Array<PoPieChartSeries> = new Array()
  newDeathsPerStateData: Array<PoPieChartSeries> = new Array()

  constructor(
    private _router: Router,
    private _service: APIService,
  ) {
  }

  public readonly columnsDetails: Array<PoTableColumn> = [
    { property: 'last_available_date', label: 'Data', type: 'date' },
    { property: 'state', label: 'Estado', type: 'string' },
    { property: 'last_available_confirmed', label: 'Casos', type: 'number' },
    { property: 'new_confirmed', label: 'Novos casos', type: 'number' },
    { property: 'last_available_deaths', label: 'Mortes', type: 'number' },
    { property: 'new_deaths', label: 'Novas mortes', type: 'number' },
  ];

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
      this.statusResponse = 200
      this.isLoading = false
    }, err => {
      this.statusResponse = 500
      this.isLoading = false
    })
  }

}
