import { Component, OnInit, Input } from "@angular/core";
import { Menu } from "@ionic/angular";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  links = [
    { path: "/UserStores", title: "User Stores" },
    { path: "/home", title: "Home" },
    { path: "/login", title: "login" },
    { path: "/signup", title: "Sign up" },
    { path: "/EditStoreInfo", title: "EditStoreInfo" },
    { path: "/StoreBase", title: "Store base" }
  ];
  @Input() menu: Menu;
  constructor() {}

  ngOnInit() {}
}
