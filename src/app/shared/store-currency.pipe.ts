import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'storeCurrency'
})
export class StoreCurrencyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
