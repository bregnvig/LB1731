import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-hello-world',
  templateUrl: 'hello-world.component.html',
  styleUrls: ['hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {

  @Input() public greeting = "Hello world!"

  constructor() { }

  ngOnInit() {
  }

}
