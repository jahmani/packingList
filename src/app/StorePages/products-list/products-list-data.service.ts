import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Extended, Product } from '../../interfaces/data-models';

@Injectable(
  // {
  // providedIn: 'root'
  // }
)
export class ProductsListDataService {
  filteredProducts: Observable<Extended<Product>[]>;
  slideIndex: number;

  constructor() { }
}
