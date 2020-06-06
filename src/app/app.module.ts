import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { NgModule } from '@angular/core';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from "@po-ui/ng-templates"
import { LottieModule } from "ngx-lottie"
import { NgxPaginationModule } from "ngx-pagination"
import player from 'lottie-web'
import { ROUTES } from "./app.routing"

import { AppComponent } from './app.component';
import { ByStateComponent } from './cases/by-state/by-state.component';
import { ByCityComponent } from './cases/by-city/by-city.component';
import { LoadingComponent } from './components/loading/loading.component';

export function playerFactory() {
  return player
}

@NgModule({
  declarations: [
    AppComponent,
    ByStateComponent,
    ByCityComponent,
    LoadingComponent
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
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
