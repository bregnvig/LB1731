import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PlaygroundService } from 'src/app/shared';

@Component({
    selector: 'loop-non-template-outlet',
    templateUrl: './non-template-outlet.component.html',
    styleUrls: ['./non-template-outlet.component.scss'],
    standalone: false
})
export class NonTemplateOutletComponent implements OnInit {

  playgrounds$ = this.service.playgrounds$;
  filterControl = new UntypedFormControl();

  constructor(private service: PlaygroundService) { }

  ngOnInit(): void {
    this.playgrounds$ = combineLatest([
      this.service.playgrounds$,
      this.filterControl.valueChanges.pipe(
        debounceTime(300),
        startWith(''),
        map((term: string) => term.toLocaleLowerCase())
      )
    ]).pipe(
      map(([playgrounds, term]) => playgrounds.filter(p => p.name.toLocaleLowerCase().includes(term)))
    );
  }
}
