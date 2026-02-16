import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.css'],
  imports: [NgIf]
})
export class CaseStudyComponent {

  protected show = true;

  protected toggle() {
    this.show = !this.show;
  }

}
