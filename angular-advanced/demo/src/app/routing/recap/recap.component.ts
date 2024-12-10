import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type Transform = 'lowercase' | 'uppercase' | 'capitalized' | 'monospace';

@UntilDestroy()
@Component({
  selector: 'loop-recap',
  templateUrl: './recap.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecapComponent implements OnInit, OnDestroy {

  private row: number | undefined;

  transform$!: Observable<string>;
  links!: any[];

  constructor(private router: Router, public route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.links = [
      { label: 'Show all', url: [{}] },
      { label: 'show 1', url: [{ row: 1 }] },
      { label: 'show 2', url: [{ row: 2 }] },
      { label: 'show 3', url: [{ row: 3 }] },
    ];

    this.transform$ = this.route.params.pipe(
      map<Params, Transform>(params => params['transform']),
      map(transform => transform === 'monospace' ? 'font-monospace' : `text-${transform}`)
    );
    this.route.params.pipe(
      map<Params, number | undefined>(params => params['row'] && parseInt(params['row'])),
      untilDestroyed(this),
    ).subscribe(row => this.row = row);
  }

  ngOnDestroy(): void {
    console.log('Recap component destroyed');
  }

  showRow(row: number) {
    return !this.row || row === this.row;
  }

  goto(row?: number | undefined) {
    this.router.navigate([row ? { row } : {}], { relativeTo: this.route });
  }
}
