import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('Current URL', this.router.routerState.snapshot.url);
  }

  public gotoOrder(orderId: number) {
    this.router.navigate([orderId], {relativeTo: this.route});
  }

}


