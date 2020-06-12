import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { APIService } from "../../services/api.service"
import { CasoFull } from "../../models/caso_full.model"

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
  Data: CasoFull[] = new Array

  constructor(
    private _router: Router,
    private _service: APIService,
  ) {
  }

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
  }

  ngOnDestroy(): void {
    this.request.unsubscribe()
  }

}
