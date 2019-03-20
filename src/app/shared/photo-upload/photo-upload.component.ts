import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { DomSanitizer } from '@angular/platform-browser';
import { ImageEditorPage } from '../../pages/image-editor/image-editor.page';
import { ImageSaveInfo } from '../../interfaces/data-models';
import { EditPhotoPage } from '../../pages/edit-photo/edit-photo.page';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {

  // loaded = false;
  @Input() imgInfo: ImageSaveInfo ;
  constructor(
    private modalCtrl: ModalController,
  //  private sanitizer: DomSanitizer
  ) {
    // this.imagesFsRepository = this.navParams.get("imagesFsRepository");
  }

  // sanitize(url) {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }
  upload() {
    return this.modalCtrl.dismiss(this.imgInfo, "upload");
  }
  close() {
    this.modalCtrl.dismiss();
  }
  async showEditImage() {
    const imgEditor = await this.modalCtrl.create({ component: EditPhotoPage, componentProps: { imgInfo: this.imgInfo } });
    await imgEditor.present();
    imgEditor.onDidDismiss().then(((res) => {
      if (res && res.data) {
        console.log("EditorResults: ", res.data);
        this.imgInfo = res.data;
      }
    }));

  }
  ngOnInit() {
  }

}
