import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NgModule } from '@angular/core';
import { ROUTES } from "./app.routing"
import { RouterModule } from "@angular/router"
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from "@po-ui/ng-templates"

import { AppComponent } from './app.component';
import { ByStateComponent } from './cases/by-state/by-state.component';

@NgModule({
  declarations: [
    AppComponent,
    ByStateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    PoModule,
    PoTemplatesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
