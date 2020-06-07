import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { APIService } from "../../services/api.service"
import { Caso } from "../../models/caso.model"

@Component({
  selector: 'app-by-state',
  templateUrl: './by-state.component.html',
  styleUrls: ['./by-state.component.css']
})
export class ByStateComponent implements OnInit, OnDestroy {

  limit: number = 50
  request: Subscription
  isLoading: boolean
  Data: Caso[] = new Array

  constructor(
    private _router: Router,
    private _service: APIService,
  ) {
  }

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    this._service.params = this._service.params.append('is_last', 'True')
    this._service.params = this._service.params.append('page', '1')
    this._service.params = this._service.params.append('place_type', 'state')
    this._service.params = this._service.params.append('page_size', this.limit.toString())
    this.getDataCasos()
  }

  ngOnDestroy(): void {
    this.request.unsubscribe()
  }

  getDataCasos() {
    this.isLoading = true
    this.request = this._service.getDataCasos().subscribe(response => {
      this.Data = response.body['results']
      this.isLoading = false
    }, err => {
      this.isLoading = false
    })
  }

}
