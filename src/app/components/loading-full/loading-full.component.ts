import { Component, OnInit, Input } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-loading-full',
  templateUrl: './loading-full.component.html',
  styleUrls: ['./loading-full.component.css']
})
export class LoadingFullComponent implements OnInit {

  @Input() condition: any
  
  options: AnimationOptions = {
    path: '/assets/animations/loading.json'
  }

  styles: Partial<CSSStyleDeclaration> = {
    marginLeft: '550px',
    marginTop: '120px'
  }

  constructor() { }

  ngOnInit(): void {
  }


}
