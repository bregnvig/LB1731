import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-io-event-child',
  template: `
    <p>
      <input type="radio" name="newsletter" (click)="update('weekly')"> Weekly<br>
      <input type="radio" name="newsletter" (click)="update('monthly')"> Monthly
    </p>
  `

})
export class IOEventChildComponent {
  @Output() public period = new EventEmitter<string>();

  public update(value: string) {
    this.period.emit(value);
  }
}

@Component({
  selector: 'app-io-event',
  templateUrl: 'event.component.html',
  styleUrls: ['event.component.css']
})
export class IOEventComponent implements OnInit {

  public newsletterPeriod: string;

  constructor() { }

  ngOnInit() {
  }

  public updateNewsletterPeriod(period: string) {
    this.newsletterPeriod = period;
  }

}
