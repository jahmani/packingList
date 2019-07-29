import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsListPage } from '../products-list/products-list.page';
import { Router, ActivatedRoute } from '@angular/router';
import { NavParams, IonList } from '@ionic/angular';
import { CatalogService, ProductsService } from '../../providers/catalogData/catalog-data.service';
import { Observable, combineLatest, of } from 'rxjs';
import { Extended, Product } from '../../interfaces/data-models';
import { FormControl } from '@angular/forms';
import { map, switchMap, flatMap, debounceTime, startWith } from 'rxjs/operators';
import { ActiveStoreService } from '../../providers/AppData/active-store.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
})
export class CatalogPage implements OnInit {


  private productsRep: ProductsService;
  products: Observable<Extended<Product>[]>;
  showSerach = true;
  searchControl: FormControl;
  showSlideDetails = true;
  filteredProducts: Observable<Extended<Product>[]>;
  view: "LIST" | "CARDS" | "SLIDES" = "SLIDES";
  @ViewChild('slidingItem1', {static: false}) dynamicList1: IonList;
  @ViewChild('slidingItem2', {static: false}) dynamicList2: IonList;
  get dynamicList(): IonList {
    return this.dynamicList1 ? this.dynamicList1 : this.dynamicList2;
  }



  constructor(
    private router: Router,
    private activeStoreService: ActiveStoreService,
    private rout: ActivatedRoute,
    private catalogService: CatalogService
  ) {
    this.products = this.rout.paramMap.pipe(
      switchMap(paramMap => {
        const storeId = paramMap.get("storeId");
        if (storeId) {
          return of(storeId);
        } else {
          return activeStoreService.activeStoreKey$;
        }}),
      map(storeId => this.catalogService.forStore(storeId)),
      flatMap(prodService => prodService.FormatedList)
    );
    this.searchControl = new FormControl();


  }
  switchView() {
    if (this.dynamicList) {
      this.dynamicList.closeSlidingItems();
    }
    // this.view = this.view === 'LIST' ? 'CARDS' : 'LIST';
    switch (this.view) {
      case "LIST":
        this.view = "CARDS";
        break;
      case "CARDS":
        this.view = "SLIDES";
        break;
      case "SLIDES":
        this.view = "LIST";
        break;
      default:
        break;
    }
  }
  toggleSearch() {
    if (this.searchControl) {
      this.searchControl.setValue("");
    }
    this.showSerach = !this.showSerach;
  }

  private initFilteredProducts() {
    // searchControl.valueChanges will not emit values untill the user make input
    // combineLatest will not emit values untill both ovseravables emit values
    const initializedValueChanges = this.searchControl.valueChanges.pipe(
      debounceTime(700),
      map(v => (v + "").trim()),
      startWith(""),
      //  tap(console.log)
    );
    // initializedValueChanges.subscribe(console.log);

    this.filteredProducts = combineLatest(
      initializedValueChanges,
      this.products
    ).pipe(
      map(([searcTerm, extProducts]) => {
        if (!searcTerm || !searcTerm.length) {
          return extProducts;
        }
        return extProducts.filter(extAccount => {
          return (
            extAccount.data.name
              .toUpperCase()
              .includes(searcTerm.toUpperCase()) ||
            extAccount.data.style
              .toUpperCase()
              .includes(searcTerm.toUpperCase())
          );
        });
      })
    );
  }

  ngOnInit(): void {
    this.initFilteredProducts();
  }

}
