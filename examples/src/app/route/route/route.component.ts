import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-route',
  templateUrl: 'route.component.html',
  styleUrls: ['route.component.css']
})
export class RouteComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(val => console.log(val)),
      this.route.queryParams.subscribe(val => console.log(val))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
