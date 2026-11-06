import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {

  transform(value: string, prefix?: string): any {
    if (value && value.length === 8) {
      return `${prefix || ''} ${value.substring(0, 2)} ${value.substring(2, 4)} ${value.substring(4, 6)} ${value.substring(6)}`;
    }
    return value;
  }

}
