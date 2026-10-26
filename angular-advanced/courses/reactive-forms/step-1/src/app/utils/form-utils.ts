import { AbstractControl } from "@angular/forms";

export type TypedForm<T> = { [P in keyof T]?: AbstractControl<T[P] | null> };