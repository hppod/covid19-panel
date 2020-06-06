import { BrowserModule } from '@angular/platform-browser';
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
    RouterModule.forRoot(ROUTES),
    PoModule,
    PoTemplatesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
