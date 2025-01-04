import { Component, OnInit } from '@angular/core';
import { PhonePipe } from '../phone.pipe';

@Component({
    selector: 'app-phone',
    templateUrl: './phone.component.html',
    standalone: true,
    imports: [PhonePipe],
})
export class PhoneComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
