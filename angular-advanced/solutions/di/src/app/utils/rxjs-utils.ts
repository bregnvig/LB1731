import { pipe } from "rxjs";
import { filter, shareReplay } from "rxjs/operators";

export const withLength = <T>() => pipe(filter<T[]>(array => array?.length > 0));
export const shareLatest = <T>() => pipe(shareReplay<T>({ refCount: true, bufferSize: 1 }));