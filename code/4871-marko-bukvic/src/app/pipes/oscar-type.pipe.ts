import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'oscarType'
})
export class OscarTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
