import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PhonePipe } from '../phone.pipe';

@Component({
    selector: 'app-phone',
    template: `
      <h2>Phone no</h2>
      <p>
        Without prefix {{'28712234' | phone }}
      </p>
      <p>
        With prefix {{'28712234' | phone:'+45' }}
      </p>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [PhonePipe]
})
export class PhoneComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
