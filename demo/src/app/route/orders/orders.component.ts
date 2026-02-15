import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css'],
    imports: [RouterOutlet]
})
export class OrdersComponent implements OnInit {

  #router = inject(Router);
  #route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit() {
    console.log('Current URL', this.#router.routerState.snapshot.url);
  }

   gotoOrder(orderId: number) {
    this.#router.navigate([orderId], {relativeTo: this.#route});
  }

}


