import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

@Component({
  selector: 'loop-top-five',
  templateUrl: './top-five.component.html',
  styleUrls: ['./top-five.component.scss']
})
export class TopFiveComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  @ViewChild('inputControl', { static: true }) inputControl!: HTMLInputElement;
  emailControl = new FormControl(undefined, Validators.required);
  emitEventControl = new FormControl(true, Validators.required);
  classes: string | undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.emailControl.valueChanges.pipe(
      this.takeUntilDestroyed(),
    ).subscribe(_ => console.log(_));
  }

}
