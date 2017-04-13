import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pure'
})
export class PurePipe implements PipeTransform {
  constructor() {
    console.log('Pure pipe constructed');
  }

  transform(value: any, args?: any): any {
    console.log(`Pure pipe`);
    return value;
  }

}

@Pipe({
  name: 'impure',
  pure: false
})
export class ImpurePipe implements PipeTransform {

  constructor() {
    console.log('Impure pipe constructed');
  }

  transform(value: any, args?: any): any {
    console.log('Impure pipe');
    return value;
  }

}
