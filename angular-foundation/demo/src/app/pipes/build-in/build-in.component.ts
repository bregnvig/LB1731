import { Component, OnInit } from '@angular/core';
import { UpperCasePipe, LowerCasePipe, JsonPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-build-in',
    template: `
      <h2>Build-in</h2>
      <div class="row g-3">
        <h3>Date</h3>
        <p>
          Today is {{today | date}}
        </p>
        <p>
          Today is {{today | date:'yy-MM-dd'}}
        </p>
        <p>
          Time is {{today | date:'hh:mm'}}
        </p>
        <input class="form-control" type="text" [(ngModel)]="format">
        <p>
          Formatted {{today | date:format}}
        </p>
      </div>
      <div class="row g-3">
        <h3>Uppercase & lowercase</h3>
        <input class="form-control" type="text" [(ngModel)]="name">
        <p>
          Uppercase {{name | uppercase}}
        </p>
        <p>
          Lowecase {{name | lowercase}}
        </p>
      </div>
      <div class="row g-3">
        <h3>Currency</h3>
        <p>
          Curerncy {{17.1234 | currency}}
        </p>
        <p>
          Curerncy {{17.1234 | currency:'USD':true}}
        </p>
        <p>
          Curerncy {{17.1234 | currency:'USD':true:'1.2-2'}}
        </p>
      </div>
      <div class="row g-3">
        <h3>JSON</h3>
        <p>
          JSON {{object | json}}
        </p>
      </div>
    `,
    imports: [
        FormsModule,
        UpperCasePipe,
        LowerCasePipe,
        JsonPipe,
        CurrencyPipe,
        DatePipe,
    ]
})
export class BuildInComponent implements OnInit {

  protected today = new Date();
  protected format = 'G';
  protected name = 'Angular';
  protected object = {
    a: 'b',
    b: 'c',
    c: 42
  };

  constructor() { }

  ngOnInit() {
  }

}
