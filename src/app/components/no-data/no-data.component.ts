import { Component, OnInit, Input } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {

  @Input() condition: any

  options: AnimationOptions = {
    path: '/assets/animations/no-data.json',
    loop: false
  }

  styles: Partial<CSSStyleDeclaration> = {
    marginLeft: '570px',
    marginTop: '120px'
  }

  constructor() { }

  ngOnInit(): void {
  }
}
