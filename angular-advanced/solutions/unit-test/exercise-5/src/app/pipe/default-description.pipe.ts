import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultDescription'
})
export class DefaultDescriptionPipe implements PipeTransform {

  transform(value: string | undefined): string {
    return value || 'Ingen beskrivelse';
  }

}
