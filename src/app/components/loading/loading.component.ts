import { Component, OnInit, Input } from '@angular/core'
import { AnimationOptions } from "ngx-lottie"

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() condition: any
  
  options: AnimationOptions = {
    path: '/assets/animations/loading.json'
  }

  styles: Partial<CSSStyleDeclaration> = {
    marginLeft: '275px',
    marginTop: '0px'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
