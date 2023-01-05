import { pipe } from "rxjs";
import { filter } from "rxjs/operators";

export const withLength = <T>() => pipe(filter<T[]>(array => array?.length > 0));