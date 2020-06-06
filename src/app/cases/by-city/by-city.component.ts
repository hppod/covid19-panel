import { Component, OnInit, OnDestroy } from '@angular/core';
import { PoChartGaugeSerie, PoChartType } from '@po-ui/ng-components';
import { Subscription } from "rxjs"
import { ByCityService } from "./../../services/by-city.service"
import { City } from "./../../models/city.model"

@Component({
  selector: 'app-by-city',
  templateUrl: './by-city.component.html',
  styleUrls: ['./by-city.component.css']
})
export class ByCityComponent implements OnInit, OnDestroy {

  request: Subscription
  Data: City[]

  constructor(
    private _service: ByCityService
  ) { }

  ngOnInit(): void {
    this._service.params = this._service.params.append('is_last', 'True')
    this._service.params = this._service.params.append('page_size', '5000')
    this._service.params = this._service.params.append('state', 'SP')
    this.getDataCasos()
  }

  ngOnDestroy(): void {
    this.request.unsubscribe()
  }

  getDataCasos() {
    this.request = this._service.getDataCasos().subscribe(response => {
      this.Data = response.body['results']
    }, err => {

    })
  }

}
