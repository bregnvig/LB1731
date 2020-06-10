import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

   orderNo: number;
   exact = false;

   data = {
    foo: 'bar'
  }



  constructor(private route: ActivatedRoute) {
    console.log('Order constructed');
  }

   ngOnDestroy() {
    console.log('Component destroyed', this.orderNo);
  }

  ngOnInit() {
    this.route.params.subscribe((data: {id: number}) => {
      console.log(data);
      this.orderNo = data.id
    });
    this.route.queryParams.subscribe((data: any) => {
      // console.log('Query params', data);

    });
    // this.orderNo = this.activatedRoute.snapshot.params['id'];
  }

   toggle() {
    this.exact = !this.exact;
  }
}
