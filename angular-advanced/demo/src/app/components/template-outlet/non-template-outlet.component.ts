import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PlaygroundService } from 'src/app/shared';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'loop-non-template-outlet',
  templateUrl: './non-template-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe]
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
