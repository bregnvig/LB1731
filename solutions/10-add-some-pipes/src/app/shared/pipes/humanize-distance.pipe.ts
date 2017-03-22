import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanizeDistance'
})
export class HumanizeDistancePipe implements PipeTransform {

  transform(value: string | number, args?: any): any {
    if (typeof value !== 'number') {
      return value;
    }
    if (value <= 750) {
      return `${value} m`;
    } else if (value <= 1500) {
      return 'Et stykke vej'
    } 
    return 'Ikke til fods!';
  }
}
