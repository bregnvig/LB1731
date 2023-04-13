import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'loop-missing-playground',
  template: `
    <h3>Playground with id: {{id}} is gone 😰</h3>
    <p>You must accept that it is gone!</p>
    <div class="row form-group">
      <div class="col">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="acceptIt" [formControl]="acceptIt">
          <label class="form-check-label" for="acceptIt">Accept</label>
        </div>
      </div>
    </div>
    <div class="row form-group">
      <div class="col">
        <a class="btn btn-primary" [routerLink]="['/routing', 'guard']">OK</a>
      </div>
    </div>
  `,
})
export class MissingPlaygroundComponent implements OnInit {

  id!: string;
  acceptIt = new UntypedFormControl(false);

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
  }

}
