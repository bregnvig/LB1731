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
  @Output() public interval = new EventEmitter<string>();

  public update(value: string) {
    this.interval.emit(value);
  }
}

@Component({
  selector: 'app-io-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class IOEventComponent implements OnInit {

  public newsletterInterval: string;

  constructor() { }

  ngOnInit() {
  }

  public updateNewsletterInterval(interval: string) {
    this.newsletterInterval = interval;
  }

}
