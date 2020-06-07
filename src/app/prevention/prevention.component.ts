import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-prevention',
  templateUrl: './prevention.component.html',
  styleUrls: ['./prevention.component.css']
})
export class PreventionComponent implements OnInit {

  optionsWashHands: AnimationOptions = {
    path: '/assets/animations/prevention/wash-hands.json'
  }

  optionsSocialDistancing: AnimationOptions = {
    path: '/assets/animations/prevention/social-distancing.json'
  }

  optionsStayHome: AnimationOptions = {
    path: '/assets/animations/prevention/stay-home.json'
  }

  optionsUseMask: AnimationOptions = {
    path: '/assets/animations/prevention/mask.json'
  }

  optionsDoctors: AnimationOptions = {
    path: '/assets/animations/prevention/doctors.json'
  }

  optionsContact: AnimationOptions = {
    path: '/assets/animations/prevention/contact.json'
  }

  styles: Partial<CSSStyleDeclaration> = {
    marginLeft: '60px',
    marginTop: '0px'
  }

  stylesDoctors: Partial<CSSStyleDeclaration> = {
    marginLeft: '185px',
    marginTop: '0px'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
