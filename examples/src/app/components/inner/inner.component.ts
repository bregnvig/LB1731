import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-inner',
  templateUrl: './inner.component.html',
  styleUrls: ['./inner.component.css']
})
export class InnerComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    console.log('Constructed');
  }

  public ngOnDestroy() {
    console.log('Destroyed!!');
  }

}
