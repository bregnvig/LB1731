import { CommonModule } from "@angular/common";
import { Component, effect, inject, input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Playground } from "src/app/shared";
import { RxresourcePlaygroundStore } from "./rxresource-playground.store";

@Component({
  selector: 'loop-rxresource-service-store-item',
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
export class RxresourceServiceStoreItemComponent implements OnInit {
  #store = inject(RxresourcePlaygroundStore);
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
  selector: 'loop-rxresource-service-store-list',
  standalone: true,
  imports: [CommonModule, RxresourceServiceStoreItemComponent],
  template: `
    @if(store.playgroundsLoading()) {
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    }
    @if(store.playgroundsError()) {
      <div class="alert alert-danger" role="alert">
        Error: {{ store.playgroundsError() }}
      </div>
    }
    @for (playground of store.playgrounds(); track playground.id) {
      <loop-rxresource-service-store-item [playground]="playground"/>
    }
  `,
})
export class RxresourceServiceStoreListComponent {
  store = inject(RxresourcePlaygroundStore);
}

@Component({
  selector: 'loop-rxresource-service-store',
  standalone: true,
  imports: [CommonModule, RxresourceServiceStoreListComponent],
  providers: [RxresourcePlaygroundStore],
  template: `
    <h1>Playgrounds</h1>
    <loop-rxresource-service-store-list />
  `,
})
export class RxresourceServiceStoreComponent { }
