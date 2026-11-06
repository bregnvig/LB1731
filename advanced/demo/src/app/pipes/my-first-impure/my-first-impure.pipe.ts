import { OnDestroy, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myFirstImpure',
    pure: false,
    standalone: false
})
export class MyFirstImpurePipe implements PipeTransform, OnDestroy {

  transform(value: string): string {
    console.log(`Impure ${value}`);
    return `My first impure ${value}`;
  }

  ngOnDestroy(): void {
    console.log('Impure pipe destroyed');
  }

}
