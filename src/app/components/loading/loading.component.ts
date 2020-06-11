import { Component, OnInit } from '@angular/core'
import { AnimationOptions } from "ngx-lottie"

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  options: AnimationOptions = {
    path: '/assets/animations/loading.json'
  }

  styles: Partial<CSSStyleDeclaration> = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
