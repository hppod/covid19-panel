import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { PoComboOption } from '@po-ui/ng-components';
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
  SearchByStateForm: FormGroup
  States: PoComboOption[] = new Array()

  constructor(
    private _router: Router,
    private _service: ByCityService,
    private _builder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    this._service.params = this._service.params.append('is_last', 'True')
    this._service.params = this._service.params.append('page_size', '5000')
    this.getDataCasos()
    this.initForm()
    this.getStates()
  }

  ngOnDestroy(): void {
    this.request.unsubscribe()
  }

  initForm() {
    this.SearchByStateForm = this._builder.group({
      state: this._builder.control(null)
    })
  }

  getDataCasos() {
    this.request = this._service.getDataCasos().subscribe(response => {
      this.Data = response.body['results']
    }, err => {

    })
  }

  onChangeState($event) {
    this._service.params = this._service.params.append('state', $event)
    this.getDataCasos()
  }

  getStates() {
    this.request = this._service.getStates().subscribe(response => {
      for (let i = 0; i < response.body.length; i++) {
        this.States.push({
          label: response.body[i]['nome'],
          value: response.body[i]['sigla']
        })
      }
    })
  }

}
