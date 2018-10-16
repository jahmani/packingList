import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-edit-order-header",
  templateUrl: "./edit-order-header.page.html",
  styleUrls: ["./edit-order-header.page.scss"]
})
export class EditOrderHeaderPage implements OnInit {
  orderId$: Observable<string>;
  constructor(private route: ActivatedRoute) {
    this.orderId$ = this.route.paramMap.pipe(
      map(value => {
        return value.get("id");
      })
    );
  }

  ngOnInit() {}
}
