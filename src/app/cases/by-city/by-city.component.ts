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

  limit: number = 200

  request: Subscription
  isLoading: boolean
  p: number
  count: number
  stateSelected: boolean = false
  Data: City[] = new Array
  SearchByStateForm: FormGroup
  States: PoComboOption[] = new Array()
  Districts: PoComboOption[] = new Array()

  constructor(
    private _router: Router,
    private _service: ByCityService,
    private _builder: FormBuilder
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    this._service.params = this._service.params.append('is_last', 'True')
    this._service.params = this._service.params.append('page', '1')
    this._service.params = this._service.params.append('place_type', 'city')
    this._service.params = this._service.params.append('page_size', this.limit.toString())
    this.getDataCasos()
    this.getStates()
  }

  ngOnDestroy(): void {
    this.request.unsubscribe()
  }

  initForm() {
    this.SearchByStateForm = this._builder.group({
      state: this._builder.control(null),
      district: this._builder.control(null)
    })
  }

  getDataCasos() {
    this.isLoading = true
    this.request = this._service.getDataCasos().subscribe(response => {
      this.checkDataReceived(response.body['results'])
      this.count = response.body['count']
      this.isLoading = false
    }, err => {
      this.isLoading = false
    })
  }

  checkDataReceived(data: City[]) {
    for (let i = 0; i < data.length; i++) {
      if (data[i]['city'] != 'Importados/Indefinidos') {
        this.Data.push(data[i])
      }
    }
  }

  getPage(page: number) {
    window.scroll(0,0)
    this.Data = new Array()
    this.p = page
    this._service.params = this._service.params.set('page', page.toString())
    this.getDataCasos()
  }

  onChangeState($event) {
    if ($event == null || $event == undefined) {
      this.stateSelected = false
      this.p = 1
      this._service.params = this._service.params.set('page', '1')
      this._service.params = this._service.params.delete('state')
      this.Data = new Array()
      this.getDataCasos()
    } else {
      this.p = 1
      this._service.params = this._service.params.set('page', '1')
      this._service.params = this._service.params.append('state', $event)
      this.stateSelected = true
      this.getDistricts($event)
      this.Data = new Array()
      this.getDataCasos()
    }
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

  getDistricts(district: string) {
    this.request = this._service.getDistricts(district).subscribe(response => {
      for (let i = 0; i < response.body.length; i++) {
        this.Districts.push({
          label: response.body[i]['nome'],
          value: response.body[i]['nome']
        })
      }
    })
  }

  onChangeDistrict($event) {
    if ($event == null || $event == undefined) {
      this.p = 1
      this._service.params = this._service.params.set('page', '1')
      this._service.params = this._service.params.delete('city')
      this.Data = new Array()
      this.getDataCasos()
    } else {
      this.p = 1
      this._service.params = this._service.params.set('page', '1')
      this._service.params = this._service.params.append('city', $event)
      this.Data = new Array()
      this.getDataCasos()
    }
  }

  clearConditionsClick() {
    this.p = 1
    this._service.params = this._service.params.set('page', '1')
    this.stateSelected = false
    this._service.params = this._service.params.delete('city')
    this._service.params = this._service.params.delete('state')
    this.getDataCasos()
    this.initForm()
  }

}
