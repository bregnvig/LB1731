import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclamation'
})
export class ExclamationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return (value || '') + '!';
  }

}
