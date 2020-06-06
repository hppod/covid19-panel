import { Routes } from "@angular/router"

import { ByStateComponent } from "./cases/by-state/by-state.component"
import { ByCityComponent } from "./cases/by-city/by-city.component"

export const ROUTES: Routes = [
    { path: '', redirectTo: 'cases/by-state', pathMatch: 'full' },
    {
        path: 'cases', children: [
            { path: 'by-state', component: ByStateComponent },
            { path: 'by-city', component: ByCityComponent }
        ]
    }
]