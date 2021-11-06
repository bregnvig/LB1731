import { pipe } from "rxjs";
import { filter, shareReplay } from "rxjs/operators";

export const withLength = <T>() => pipe(filter<T[]>(array => array?.length > 0));
export const shareLatest = <T>() => pipe(shareReplay<T>({ bufferSize: 1, refCount: true }));
export const truthy = <T>() => pipe(filter((a: T) => !!a));

