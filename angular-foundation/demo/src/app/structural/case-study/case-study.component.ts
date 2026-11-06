import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-case-study',
  template: `
    <h1>Case study</h1>
    <div class="pane-container center-content">
      <div class="pane">
        <h2>ng-if</h2>
        <button class="btn btn-default" (click)="toggle()">Toggle show</button>
        <p>Value of show: <b>{{show}}</b></p>
        <p *ngIf="show">
          Show when truthy
        </p>
        <p *ngIf="!show">
          Show when falsy
        </p>
      </div>
      <div class="pane">
        <h2>Using template</h2>
        <p>
          Hip!
        </p>
        <ng-template>
          <p>
            Hip!
          </p>
        </ng-template>
        <p>
          Hooray!
        </p>
      </div>
    </div>
  `,
  imports: [NgIf]
})
export class CaseStudyComponent {

  protected show = true;

  protected toggle() {
    this.show = !this.show;
  }

}
