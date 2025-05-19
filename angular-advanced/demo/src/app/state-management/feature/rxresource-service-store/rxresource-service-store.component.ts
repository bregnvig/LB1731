import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Playground } from "src/app/shared";
import { RxresourcePlaygroundStore } from "./rxresource-playground.store";

@Component({
  selector: 'loop-rxresource-service-store-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="d-flex">
      <div class="input-group mb-3">
        <span class="input-group-text">Name</span>
        <input type="text" name="name" [(ngModel)]="name" class="form-control">
        <span class="input-group-text">Description</span>
        <input type="text" name="description" [(ngModel)]="description" class="form-control">
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

  name?: string;
  description?: string;

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
    @for (playground of playgrounds(); track playground) {
      <loop-rxresource-service-store-item [playground]="playground"/>
    }
  `,
})
export class RxresourceServiceStoreListComponent {
  #store = inject(RxresourcePlaygroundStore);
  playgrounds = this.#store.playgrounds;
  loading = this.#store.loading;
  error = this.#store.error;
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
