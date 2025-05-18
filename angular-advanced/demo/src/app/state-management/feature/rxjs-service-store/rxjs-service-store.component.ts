import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Playground } from "src/app/shared";
import { RxjsPlaygroundStore } from "./rxjs-playground.store";

@Component({
  selector: 'loop-rxjs-service-store-item',
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
export class RxjsItemComponent implements OnInit {
  #store = inject(RxjsPlaygroundStore);
  playground = input.required<Playground>();

  name?: string;
  description?: string;

  ngOnInit() {
    this.name = this.playground().name;
    this.description = this.playground().description;
  }

  save() {
    const  { name, description } = this.playground();
    this.#store.update({ ...this.playground(), name: this.name || name, description: this.description || description });
  }
}

@Component({
  selector: 'loop-rxjs-service-store-list',
  standalone: true,
  imports: [CommonModule, RxjsItemComponent],
  template: `
    @for (playground of playgrounds | async; track playground) {
      <loop-rxjs-service-store-item [playground]="playground"/>
    }
  `,
})
export class RxjsListComponent {
  #store = inject(RxjsPlaygroundStore);
  playgrounds = this.#store.playgrounds;
}

@Component({
  selector: 'loop-rxjs-service-store',
  standalone: true,
  imports: [CommonModule, RxjsListComponent],
  providers: [RxjsPlaygroundStore],
  template: `
    <h1>Playgrounds</h1>
    <loop-rxjs-service-store-list />
  `,
})
export class RxjsServiceStoreComponent { }
