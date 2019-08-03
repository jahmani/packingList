import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {
  params:  Observable<any>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.params = this.route.queryParams;
  }


}
