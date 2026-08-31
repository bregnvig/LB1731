import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-orders',
    template: `
      <h1>Routes & navigation</h1>
      <div class="pane-container center-content">
        <div class="pane fixed-size">
          <nav>
            @for (orderId of [1,2,3]; track orderId) {
              <button class="btn btn-link" (click)="gotoOrder(orderId)">Order {{orderId}}</button>
            }
          </nav>
          <router-outlet></router-outlet>
        </div>
      </div>
    `,
    styleUrls: ['./orders.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet]
})
export class OrdersComponent implements OnInit {

  #router = inject(Router);
  #route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit() {
    console.log('Current URL', this.#router.routerState.snapshot.url);
  }

   protected gotoOrder(orderId: number) {
    this.#router.navigate([orderId], {relativeTo: this.#route});
  }

}


