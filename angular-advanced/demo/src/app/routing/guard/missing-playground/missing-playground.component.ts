import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'loop-missing-playground',
    template: `
    <div class="missing">
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
      <div class="row form-group mb-0">
        <div class="col">
          <a class="btn btn-primary" [routerLink]="['/routing', 'guard']">OK</a>
        </div>
      </div>
    </div>
  `,
    styles: `
      .missing { max-width: 40rem; padding: 1.5rem 1.75rem; border-radius: 1rem; background: #fdeef0; border-left: 4px solid #e5243b; }
      h3 { font-stretch: 85%; }
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MissingPlaygroundComponent implements OnInit {

  id!: string;
  acceptIt = new UntypedFormControl(false);

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
  }

}
