
import { Component, effect, inject, input, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Playground } from "src/app/shared";
import { SignalPlaygroundStore } from "./signal-playground.store";

@Component({
  selector: 'loop-signal-service-store-item',
  standalone: true,
  styleUrl: '../store-item.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form class="store-row">
      <div class="input-group">
        <span class="input-group-text">Name</span>
        <input type="text" name="name" [(ngModel)]="name" class="form-control" [class.update-effect]="animate">
        <span class="input-group-text">Description</span>
        <input type="text" name="description" [(ngModel)]="description" [class.update-effect]="animate" class="form-control">
      </div>
      <div>
        <button type="submit" class="btn btn-sm btn-outline-primary" (click)="save()">Save</button>
      </div>
    </form>
  `,
})
export class SignalItemComponent implements OnInit {
  #store = inject(SignalPlaygroundStore);
  playground = input.required<Playground>();

  animate = false;
  first = true;

  name?: string;
  description?: string;

  constructor() {
    effect(() => {
      this.playground()
      if (this.first) {
        this.first = false;
        return;
      }
      this.animate = false;
      requestAnimationFrame(() => this.animate = true); // re-trigger
    })
  }

  ngOnInit() {
    this.name = this.playground().name;
    this.description = this.playground().description;
  }

  save() {
    const { name, description } = this.playground();
    this.#store.update({ ...this.playground(), name: this.name || name, description: this.description || description });
  }
}

@Component({
  selector: 'loop-signal-service-store-list',
  styleUrl: '../store-list.scss',
  standalone: true,
  imports: [SignalItemComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if(loading()) {
      <div class="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <span aria-hidden="true">Loading...</span>
      </div>
    }
    @if(error()) {
      <div class="alert alert-danger" role="alert">
        Error: {{ error() }}
      </div>
    }
    @for (playground of playgrounds(); track playground.id) {
      <loop-signal-service-store-item [playground]="playground"/>
    }
  `,
})
export class SignalListComponent {
  #store = inject(SignalPlaygroundStore);
  playgrounds = this.#store.playgrounds;
  loading = this.#store.loading;
  error = this.#store.error;
}

@Component({
  selector: 'loop-signal-service-store',
  standalone: true,
  imports: [SignalListComponent],
  providers: [SignalPlaygroundStore],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <h1>Playgrounds</h1>
    <loop-signal-service-store-list />
  `,
})
export class SignalServiceStoreComponent { }
