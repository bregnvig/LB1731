import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';



@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    imports: [RouterLink, RouterLinkActive]
})
export class OrderComponent implements OnInit, OnDestroy {

  #route = inject(ActivatedRoute);

  orderNo: number = this.#route.snapshot.params['id'];
  exact = false;

  data = {
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

  toggle() {
    this.exact = !this.exact;
  }
}
