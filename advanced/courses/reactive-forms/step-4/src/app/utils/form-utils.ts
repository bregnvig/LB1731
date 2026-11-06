import { AbstractControl, FormControl } from "@angular/forms";

export type TypedForm<T> = { [P in keyof T]: AbstractControl<T[P] | null> };
export type TypedControl<T> = { [P in keyof T]: FormControl<T[P] | null> };
export type Full<T> = {
  [P in keyof T]-?: T[P];
};