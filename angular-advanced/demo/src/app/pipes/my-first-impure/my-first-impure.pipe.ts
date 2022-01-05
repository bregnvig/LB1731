import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myFirstImpure',
  pure: false
})
export class MyFirstImpurePipe implements PipeTransform {

  transform(value: string): string {
    console.log(`Impure ${value}`);
    return `My first impure ${value}`;
  }

}
