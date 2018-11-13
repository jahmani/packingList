import { Component, OnInit } from '@angular/core';
import { PackinglistInfo, Extended } from '../../interfaces/data-models';
import { Observable } from 'rxjs';
import { PackinglistInfoDataService } from '../../providers/StoreData/packinglist-info-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-packinglists',
  templateUrl: './packinglists.page.html',
  styleUrls: ['./packinglists.page.scss'],
})
export class PackinglistsPage implements OnInit {
  packinglists: Observable<Extended<PackinglistInfo>[]>;

  constructor(
    private plInfoDataService: PackinglistInfoDataService,
    public route: ActivatedRoute,
    private alertController: AlertController,
    private modalController: ModalController,
    public router: Router) {
      this.packinglists = this.plInfoDataService.List();
     }

  ngOnInit() {
  }

}
