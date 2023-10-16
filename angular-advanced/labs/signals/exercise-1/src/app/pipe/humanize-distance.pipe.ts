import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanizeDistance'
})
export class HumanizeDistancePipe implements PipeTransform {

  transform(value: string | number): string {
    if (typeof value !== 'number') {
      return value;
    }
    return `${value} m`;
  }
}
