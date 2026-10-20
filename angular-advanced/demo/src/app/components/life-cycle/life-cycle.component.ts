import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Playground, PlaygroundService } from 'src/app/shared';
import { OnChangesComponent } from './on-changes/on-changes.component';
import { OnDestroyComponent } from './on-destroy/on-destroy.component';
import { AfterViewInitComponent } from './after-view-init/after-view-init.component';

@Component({
  selector: 'loop-life-cycle',
  templateUrl: './life-cycle.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OnChangesComponent, OnDestroyComponent, AfterViewInitComponent]
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
