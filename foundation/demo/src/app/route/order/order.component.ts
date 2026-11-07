import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';



@Component({
    selector: 'app-order',
    template: `
      <h3>
        order works! This is #{{orderNo}}
      </h3>
      <nav>
        <a routerLink=".." class="btn btn-link" routerLinkActive="btn-primary" [routerLinkActiveOptions]="{exact: exact}">Orders</a>
        <a>About</a>
        <a>Contact</a>
      </nav>

      <nav style="margin: 10px 0">
        @for (orderId of [1,2,3]; track orderId) {
          <a [routerLink]="['..', orderId, data]" routerLinkActive="active">Order {{orderId}}</a>
        }
      </nav>
      <p>
        This is order no {{orderNo}}
      </p>

      <p>
        <button (click)="toggle()" class="btn btn-default">Toggle exact</button>
      </p>
    `,
    styles: `
      a {
          margin: 8px;
      }
    `,
    imports: [RouterLink, RouterLinkActive]
})
export class OrderComponent implements OnInit, OnDestroy {

  #route = inject(ActivatedRoute);

  protected orderNo: number = this.#route.snapshot.params['id'];
  protected exact = false;

  protected data = {
    foo: 'bar'
  };



  constructor() {
    console.log('Order constructed');
  }

  ngOnDestroy() {
    console.log('Component destroyed', this.orderNo);
  }

  ngOnInit() {
    this.#route.params.subscribe(params => {
      console.log(params);
      this.orderNo = params['id'];
    });
    this.#route.queryParams.subscribe((data: any) => {
      // console.log('Query params', data);

    });
    // this.orderNo = this.activatedRoute.snapshot.params['id'];
  }

  protected toggle() {
    this.exact = !this.exact;
  }
}
