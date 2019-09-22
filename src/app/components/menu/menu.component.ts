import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Extended, User, StoreInfo } from "../../interfaces/data-models";
import { AuthService } from "../../providers/Auth/auth.service";
import { IonMenu } from "@ionic/angular";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  storeLinks = [
    // { path: "/EditStoreInfo", title: "EditStoreInfo" },
    { path: "/StoreBase/OrdersList", title: "Orders List" },
    { path: "/StoreBase/ProductsList", title: "Products List" },
    { path: "/StoreBase/AccountsList", title: "Accounts List" },
    { path: "/StoreBase/PhotoGallery", title: "Photo Gallery" },
    { path: "/StoreBase/Packinglist", title: "packings" },
    { path: "/StoreBase/Packinglists", title: "Change PList" },
    // { path: "/StoreBase/catalog", title: "CatalogPage" },
    { path: "/StoreBase/StoreUsers", title: "StoreUsers" },
  ];
  noUserLinks = [
    { path: "/login", title: "login" },
    { path: "/signup", title: "Sign up" },
  ];
  userLinks = [
    { path: "/UserStores", title: "User Stores" },
  //  { path: "/logout", title: "LogOut", logOut: true },
  ];


  @Input() menu: IonMenu;
  @Input() user: Extended<User>;
  @Input() store: Extended<StoreInfo>;
  @Output() logOut: EventEmitter<boolean>;

  constructor(private authService: AuthService) {
    this.logOut = new EventEmitter();
  }

  onLogOut() {
    this.authService.signOut();
  }

  ngOnInit() {}
}
