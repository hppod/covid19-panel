import { Routes } from "@angular/router"

import { ByStateComponent } from "./cases/by-state/by-state.component"

export const ROUTES: Routes = [
    { path: '', redirectTo: 'cases/by-state', pathMatch: 'full' },
    {
        path: 'cases', children: [
            { path: 'by-state', component: ByStateComponent },
        ]
    }
]