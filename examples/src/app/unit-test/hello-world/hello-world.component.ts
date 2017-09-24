import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {

  constructor(public service: UserService, private router: Router) { }

  public ngOnInit() {
  }

  public gotoRegistration() {
    this.router.navigate(['/register']);
  }

}
