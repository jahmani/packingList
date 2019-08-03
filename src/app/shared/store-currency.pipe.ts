import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Extended, StoreInfo } from '../interfaces/data-models';

@Pipe({
  name: 'storeCurrency',
})
export class StoreCurrencyPipe implements PipeTransform {
  constructor(
    private currencePipe: CurrencyPipe,
  ) { }

  transform(value: any, storeInfo: Extended<StoreInfo>,  ...args: any[]): any {
    const curCode = storeInfo ? storeInfo.data.currency : '??';
    return this.currencePipe.transform(value, curCode, 'symbol-narrow' , '1.0');
    // return null;
  }

}
