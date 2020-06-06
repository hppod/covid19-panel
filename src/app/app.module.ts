import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ROUTES } from "./app.routing"
import { RouterModule } from "@angular/router"
import { PoModule } from '@po-ui/ng-components';

import { AppComponent } from './app.component';
import { ByStateComponent } from './cases/by-state/by-state.component';

@NgModule({
  declarations: [
    AppComponent,
    ByStateComponent
  ],
  imports: [
    BrowserModule,
    PoModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
