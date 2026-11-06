import { OnDestroy, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myFirst',
    standalone: false
})
export class MyFirstPipe implements PipeTransform, OnDestroy {

  transform(value: string): `My first ${string}` {
    console.log(`Pure ${value}`);
    return `My first ${value}`;
  }

  ngOnDestroy(): void {
    console.log('Pure pipe destroyed');
  }

}
