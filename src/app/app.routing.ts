import { Routes } from "@angular/router"

import { ByStateComponent } from "./cases/by-state/by-state.component"
import { ByCityComponent } from "./cases/by-city/by-city.component"
import { ByCountryComponent } from './cases/by-country/by-country.component'
import { AboutComponent } from './about/about.component'

export const ROUTES: Routes = [
    { path: '', redirectTo: 'cases/by-country', pathMatch: 'full' },
    {
        path: 'cases', children: [
            { path: 'by-country', component: ByCountryComponent },
            { path: 'by-state', component: ByStateComponent },
            { path: 'by-city', component: ByCityComponent }
        ]
    },
    { path: 'about', component: AboutComponent }
]