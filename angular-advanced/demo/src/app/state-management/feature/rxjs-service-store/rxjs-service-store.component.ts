import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, effect, inject, input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Playground } from "src/app/shared";
import { RxjsPlaygroundStore } from "./rxjs-playground.store";

@Component({
  selector: 'loop-rxjs-service-store-item',
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
export class RxjsServiceStoreItemComponent implements OnInit {
  #store = inject(RxjsPlaygroundStore);
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
    this.#store.update({ ...this.playground(), name: this.name || name, description: this.description || description }).subscribe();
  }
}

@Component({
  selector: 'loop-rxjs-service-store-list',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RxjsServiceStoreItemComponent],
  template: `
    @if(loading | async) {
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    }
    @if(error | async) {
      <div class="alert alert-danger" role="alert">
        Error: {{ error | async }}
      </div>
    } 
    @for (playground of playgrounds | async; track playground.id) {
      <loop-rxjs-service-store-item [playground]="playground"/>
    }
  `,
})
export class RxjsServiceStoreListComponent {
  #store = inject(RxjsPlaygroundStore);
  playgrounds = this.#store.playgrounds;
  loading = this.#store.loading;
  error = this.#store.error;
}

@Component({
  selector: 'loop-rxjs-service-store',
  standalone: true,
  imports: [CommonModule, RxjsServiceStoreListComponent],
  providers: [RxjsPlaygroundStore],
  template: `
    <h1>Playgrounds</h1>
    <loop-rxjs-service-store-list />
  `,
})
export class RxjsServiceStoreComponent { }
