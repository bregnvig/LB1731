import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myFirst'
})
export class MyFirstPipe implements PipeTransform {

  transform(value: string): string {
    console.log(`Pure ${value}`);
    return `My first ${value}`;
  }

}
