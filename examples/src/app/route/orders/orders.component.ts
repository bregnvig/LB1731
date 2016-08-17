import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('Current URL', this.router.routerState.snapshot.url);
  }

  public gotoOrder(orderId: number) {
    this.router.navigate(['/route/orders', orderId]);
  }

}


