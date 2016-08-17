import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-order',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.css']
})
export class OrderComponent implements OnInit {

  public orderNo: number;
  public exact = false;

  public param1 = {
    foo: 'bar',
    value: 17
  };

  public param2 = this;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.forEach((data: {orderId: number}) => this.orderNo = data.orderId);
  }

  public toggle() {
    this.exact = !this.exact;
  }
}
