import { Pipe, PipeTransform } from '@angular/core';
import { formatOscarType } from '../utlis/movie-utils';

/** {{ 'bestPicture' | oscarType }} -> Best Picture */
@Pipe({ name: 'oscarType' })
export class OscarTypePipe implements PipeTransform {
  transform(key: string): string {
    return formatOscarType(key);
  }
}