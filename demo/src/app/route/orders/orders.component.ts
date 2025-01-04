import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css'],
    imports: [NgFor, RouterOutlet]
})
export class OrdersComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('Current URL', this.router.routerState.snapshot.url);
  }

   gotoOrder(orderId: number) {
    this.router.navigate([orderId], {relativeTo: this.route});
  }

}


