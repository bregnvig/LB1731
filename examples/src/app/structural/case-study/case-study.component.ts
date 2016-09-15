import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-study',
  templateUrl: 'case-study.component.html',
  styleUrls: ['case-study.component.css']
})
export class CaseStudyComponent {

  public show = true;

  public toggle() {
    this.show = !this.show;
  }

}
