import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) return '';
    else{
      if(value == 'c'){
        return 'Completed'
      }
      else if(value == 'r'){
        return 'Rejected'
      }
      else if(value == 'a'){
        return 'Accepted'
      }
      else{
        return value
      }
    }
  }

}
