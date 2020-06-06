import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { City } from "./../models/city.model"

@Injectable({
    providedIn: 'root'
})
export class ByCityService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()

    getDataCasos(): Observable<HttpResponse<City[]>> {
        return this.http.get<City[]>(`https://brasil.io/api/dataset/covid19/caso/data`, { params: this.params, observe: 'response' })
    }

    getStates(): Observable<HttpResponse<any[]>> {
        return this.http.get<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`, { observe: 'response' })
    }
}