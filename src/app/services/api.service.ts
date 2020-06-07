import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { Caso } from "../models/caso.model"

@Injectable({
    providedIn: 'root'
})
export class APIService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()

    getDataCasos(): Observable<HttpResponse<Caso[]>> {
        return this.http.get<Caso[]>(`https://brasil.io/api/dataset/covid19/caso/data`, { params: this.params, observe: 'response' })
    }

    getStates(): Observable<HttpResponse<any[]>> {
        return this.http.get<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`, { observe: 'response' })
    }

    getDistricts(district: string): Observable<HttpResponse<any[]>> {
        return this.http.get<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${district}/distritos?orderBy=nome`, { observe: 'response' })
    }
}