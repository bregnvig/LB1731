import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Playground, PlaygroundService } from 'src/app/shared';
import { AfterNextRender } from './after-view-init/after-next-render';
import { AfterViewInitComponent } from './after-view-init/after-view-init.component';
import { OnChangesComponent } from './on-changes/on-changes.component';
import { OnDestroyComponent } from './on-destroy/on-destroy.component';

@Component({
  selector: 'loop-life-cycle',
  template: `
    <ol class="timeline">
      <li>
        <h5>OnChanges <code>input() → computed()</code></h5>
        <loop-on-changes />
      </li>
      <li>
        <h5>OnDestroy <code>ngOnDestroy()</code></h5>
        <loop-on-destroy />
      </li>
      <li>
        <h5>AfterViewInit <code>ngAfterViewInit() · afterNextRender()</code></h5>
        <div class="pair">
          <loop-after-view-init />
          <loop-after-next-render />
        </div>
      </li>
    </ol>
    `,
  styles: `
    @import "src/scss/variables";

    .timeline {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      position: relative;
      padding: 0 0 2.5rem 3.5rem;

      // The rail between two hooks
      &:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 2.5rem;
        bottom: .5rem;
        left: 1.1875rem;
        width: 2px;
        background: linear-gradient($azure, $cobalt);
        opacity: .35;
      }

      // A plain node: the sections are not numbered, since their order is not
      // the order the hooks run in
      &::before {
        content: "";
        position: absolute;
        top: .75rem;
        left: .5rem;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: $signal-gradient;
        box-shadow: 0 0 0 5px $white, 0 6px 16px -6px rgba($azure, .7);
      }
    }

    h5 {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: .75rem;
      min-height: 2.5rem;
      margin-bottom: 1rem;
      padding-top: .375rem;
      font-size: 1.375rem;
      font-stretch: 80%;

      code {
        font-size: .875rem;
        font-weight: 500;
        font-stretch: 100%;
      }
    }

    .pair {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
      gap: 1.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OnChangesComponent, OnDestroyComponent, AfterViewInitComponent, AfterNextRender]
})
export class LifeCycleComponent implements OnInit {

  playgrounds?: Playground[];

  constructor(private service: PlaygroundService) {
    service.playgrounds$.pipe(
      takeUntilDestroyed()
    ).subscribe(playgrounds => this.playgrounds = playgrounds);
  }

  ngOnInit(): void {
    // this.service.playgrounds$.pipe(
    //   takeUntilDestroyed()
    // ).subscribe(playgrounds => this.playgrounds = playgrounds);
  }
}
