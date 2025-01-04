import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-case-study',
    templateUrl: './case-study.component.html',
    styleUrls: ['./case-study.component.css'],
    standalone: true,
    imports: [NgIf]
})
export class CaseStudyComponent {

   show = true;

   toggle() {
    this.show = !this.show;
  }

}
