import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Menu } from "@ionic/angular";
import { Extended, User, StoreInfo } from "../../interfaces/data-models";
import { AuthService } from "../../providers/Auth/auth.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  storeLinks = [
    { path: "/EditStoreInfo", title: "EditStoreInfo" },
    { path: "/StoreBase/OrdersList", title: "Orders List" },
    { path: "/StoreBase/ProductsList", title: "Products List" },
    { path: "/StoreBase", title: "Accounts List" },
    { path: "/StoreBase/PhotoGallery", title: "Photo Gallery" },
    { path: "/StoreBase/Packinglists", title: "Packinglists" },
  ];
  noUserLinks = [
    { path: "/login", title: "login" },
    { path: "/signup", title: "Sign up" },
  ];
  userLinks = [
    { path: "/UserStores", title: "User Stores" },
    { path: "/logout", title: "LogOut", logOut: true },
  ];


  @Input() menu: Menu;
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
