import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclamation'
})
export class ExclamationPipe implements PipeTransform {

  transform(value: any): string {
    return (value || '') + '!';
  }

}
