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
    <h5>OnChanges</h5>
    <loop-on-changes></loop-on-changes>
    <hr>
    <h5>OnDestroy</h5>
    <loop-on-destroy></loop-on-destroy>
    <hr>
    <h5>AfterViewInit</h5>
    <loop-after-view-init></loop-after-view-init>
    <loop-after-next-render></loop-after-next-render>
    <hr>
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
