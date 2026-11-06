import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultDescription',
  standalone: true,
})
export class DefaultDescriptionPipe implements PipeTransform {

  transform(value: string | undefined): string {
    return value || 'No description';
  }

}
