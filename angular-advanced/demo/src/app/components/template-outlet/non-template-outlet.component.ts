import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-non-template-outlet',
  templateUrl: './non-template-outlet.component.html',
  standalone: false
})
export class NonTemplateOutletComponent implements OnInit {

  playgrounds$ = this.service.playgrounds$;
  filterControl = new FormControl<string>('', { nonNullable: true });

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
