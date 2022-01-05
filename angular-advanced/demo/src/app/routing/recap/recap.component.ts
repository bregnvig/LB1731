import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

type Transform = 'lowercase' | 'uppercase' | 'capitalized';

@Component({
  selector: 'loop-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecapComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  private row: number | undefined;

  transform$!: Observable<string>;

  constructor(private router: Router, public route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.transform$ = this.route.params.pipe(
      map<Params, Transform>(params => params['transform']),
      map(transform => `text-${transform}`)
    );
    this.route.params.pipe(
      map<Params, number | undefined>(params => params['row'] && parseInt(params['row'])),
      this.takeUntilDestroyed()
    ).subscribe(row => this.row = row);
  }

  showRow(row: number) {
    return !this.row || row === this.row;
  }

  goto(row: number | undefined) {
    this.router.navigate([{ row }], { relativeTo: this.route });
  }
}
