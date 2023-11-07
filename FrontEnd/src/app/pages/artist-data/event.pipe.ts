import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'event'
})
export class EventPipe implements PipeTransform {

  mapper:any = {
    1:'4 A.M - 9 A.M',
    2:'9 A.M - 2 P.M',
    3:'2 P.M - 7 P.M',
    4:'7 P.M - 12 A.M',
    5:'12 A.M - 4 P.M'
  }

  transform(value: any, ...args: unknown[]): unknown {
    if (!value) return '';
    return this.mapper[value]
  }

}
