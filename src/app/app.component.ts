import { Component } from '@angular/core';
import { PoNavbarItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isCollapsed: Boolean = false

  MenuItems: PoNavbarItem[] = [
    { label: 'Brasil', link: '/cases/by-country' },
    { label: 'Estados', link: '/cases/by-state' },
    { label: 'Cidades', link: '/cases/by-city' }
  ]

  onActivate($event) {
    window.scroll(0, 0)
  }

}
