import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { registerLocaleData, HashLocationStrategy, LocationStrategy } from '@angular/common';
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
import { ErrorComponent } from './components/error/error.component';
import { LoadingFullComponent } from './components/loading-full/loading-full.component';
import { PreventionComponent } from './prevention/prevention.component';
import { NoDataComponent } from './components/no-data/no-data.component';

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
    AboutComponent,
    ErrorComponent,
    LoadingFullComponent,
    PreventionComponent,
    NoDataComponent
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
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
