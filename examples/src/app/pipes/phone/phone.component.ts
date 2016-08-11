import { Component, OnInit } from '@angular/core';

import { PhonePipe } from '../phone.pipe';

@Component({
  moduleId: module.id,
  selector: 'app-phone',
  templateUrl: 'phone.component.html',
  styleUrls: ['phone.component.css'],
  pipes: [PhonePipe]
})
export class PhoneComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
