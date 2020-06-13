import { Component } from '@angular/core';
import { PoNavbarItem } from '@po-ui/ng-components';
import { Router, NavigationEnd } from '@angular/router';

declare let gtag: Function

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private _router: Router
  ) {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-168793761-1', {
          'page_path': event.urlAfterRedirects
        })
      }
    })
  }

  isCollapsed: Boolean = false

  MenuItems: PoNavbarItem[] = [
    { label: 'Brasil', link: '/cases/by-country' },
    { label: 'Estados', link: '/cases/by-state' },
    // { label: 'Cidades', link: '/cases/by-city' },
    { label: 'Como se prevenir', link: '/prevention' },
    { label: 'Sobre', link: '/about' }
  ]

  onActivate($event) {
    window.scroll(0, 0)
  }

}
