import { Component, OnInit } from '@angular/core';
import { PackinglistInfo, Extended } from '../../interfaces/data-models';
import { Observable } from 'rxjs';
import { PackinglistInfoDataService } from '../../providers/StoreData/packinglist-info-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivePListService } from '../../providers/StoreData/active-plist.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-packinglists',
  templateUrl: './packinglists.page.html',
  styleUrls: ['./packinglists.page.scss'],
})
export class PackinglistsPage implements OnInit {
  packinglists: Observable<Extended<PackinglistInfo>[]>;
  activePlistId: Observable<string>;

  constructor(
    private plInfoDataService: PackinglistInfoDataService,
    public route: ActivatedRoute,
    public activePListService: ActivePListService,
    private alertController: AlertController,
    private modalController: ModalController,
    public router: Router) {
    // const allPlist: Extended<PackinglistInfo> = { data: { name: 'ALL' } } as Extended<PackinglistInfo>;
    // this.packinglists = this.plInfoDataService.List.pipe(map(plists => [allPlist, ...plists]));
      this.packinglists = this.plInfoDataService.ListWithNewEmptyPackingInfo;
    this.activePlistId = this.activePListService.activePlistId;

  }

  ngOnInit() {
  }
  open(id: string) {
    // this.router.navigateByUrl(this.router.url + '/Packinglist/' + id);
    this.activePListService.setDefaultPlistId(id);
    window.history.back();

  }
}
