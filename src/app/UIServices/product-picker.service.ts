import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductPickerService {

  private pickProductSubject = new BehaviorSubject<any> (null);
  productPicked = this.pickProductSubject.asObservable().pipe(skip(1));
  constructor(
    private router: Router
  ) { }
  showPickProduct() {
    this.router.navigate(['/pickProduct']);
  }
  PickProduct(data) {
    this.pickProductSubject.next(data);
  }
}
