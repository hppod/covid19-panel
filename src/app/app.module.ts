import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { registerLocaleData } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from "@po-ui/ng-templates"
import { LottieModule } from "ngx-lottie"
import { NgxPaginationModule } from "ngx-pagination"
import { ChartsModule } from "ng2-charts"
import player from 'lottie-web'
import localePt from '@angular/common/locales/pt';
import { ROUTES } from "./app.routing"

import { AppComponent } from './app.component';
import { ByStateComponent } from './cases/by-state/by-state.component';
import { ByCityComponent } from './cases/by-city/by-city.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ByCountryComponent } from './cases/by-country/by-country.component';
import { AboutComponent } from './about/about.component';

export function playerFactory() {
  return player
}

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    ByStateComponent,
    ByCityComponent,
    LoadingComponent,
    ByCountryComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    PoModule,
    PoTemplatesModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgxPaginationModule,
    ChartsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
