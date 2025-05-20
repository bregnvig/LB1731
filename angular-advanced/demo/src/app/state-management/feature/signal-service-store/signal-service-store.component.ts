import { CommonModule } from "@angular/common";
import { Component, effect, inject, input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Playground } from "src/app/shared";
import { SignalPlaygroundStore } from "./signal-playground.store";

@Component({
  selector: 'loop-signal-service-store-item',
  standalone: true,
  styles: `
    @keyframes scalePulse {
      0%   { transform: scale(1); }
      30%  { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .update-effect {
      animation: scalePulse 0.3s ease-out;
    }
  `,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="d-flex">
      <div class="input-group mb-3">
        <span class="input-group-text">Name</span>
        <input type="text" name="name" [(ngModel)]="name" class="form-control" [class.update-effect]="animate">
        <span class="input-group-text">Description</span>
        <input type="text" name="description" [(ngModel)]="description" [class.update-effect]="animate" class="form-control">
      </div>
      <div>
        <button type="submit" class="btn btn-primary" (click)="save()">Save</button>
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
  standalone: true,
  imports: [CommonModule, SignalItemComponent],
  template: `
    @if(loading()) {
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
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
  imports: [CommonModule, SignalListComponent],
  providers: [SignalPlaygroundStore],
  template: `
    <h1>Playgrounds</h1>
    <loop-signal-service-store-list />
  `,
})
export class SignalServiceStoreComponent { }
