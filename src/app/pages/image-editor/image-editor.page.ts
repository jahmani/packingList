import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, AfterContentInit } from '@angular/core';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ModalController, IonContent } from '@ionic/angular';
import { ImageSaveInfo } from '../../interfaces/data-models';
// import { CropperComponent } from 'angular-cropperjs';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.page.html',
  styleUrls: ['./image-editor.page.scss'],
})
export class ImageEditorPage implements OnInit, AfterViewInit, AfterContentInit {


  // name: string;
  // data1: any;
  // croppedWidth: number;
  // croppedHeight: number;

  @Input() imgInfo: ImageSaveInfo;
  cropbox: Cropper.CropBoxData;

  @ViewChild('imageCropper', {static: false}) public imageCropper: ImageCropperComponent;
  @ViewChild('container', {static: false}) public conatainer: IonContent;
  constructor(public modalController: ModalController,
    ) {
  }

  rotaRight() {
    this.imageCropper.cropper.clear();

    this.imageCropper.cropper.rotate(90);
    const ContainerData = this.imageCropper.cropper.getContainerData();
    const CanvasData = this.imageCropper.cropper.getCanvasData();
    const widthDelta = ContainerData.width - CanvasData.width;

    const zoomRatio = widthDelta / ContainerData.width;
    this.imageCropper.cropper.zoom(zoomRatio);

  }
  cancel() {
    this.modalController.dismiss(null);
  }
  done() {
    const croppedCanava = this.imageCropper.cropper.getCroppedCanvas();
    // croppedCanava.toBlob((blob) => {
    //   const url = URL.createObjectURL(blob);
    //   const dataUrl = url; // this.sanitizer.bypassSecurityTrustUrl(url);
    //   this.modalController.dismiss(dataUrl);

    // });
    // console.log("dataurl,", dataUrl);
    this.imageCropper.exportCanvas(true);
    this.imageCropper.export.subscribe((data) => {
    //  this.imgInfo.imageString = data.dataUrl;
      console.log(data.dataUrl);
      this.modalController.dismiss(this.imgInfo);

    });

  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    //  throw new Error("Method not implemented.");
  }
  ngAfterContentInit(): void {
    // const cropperData = this.imageCropper.cropper.getCropBoxData();
    const width = ((this.conatainer as any).el as HTMLElement).clientWidth;
    const height = ((this.conatainer as any).el as HTMLElement).clientHeight;
    const left = ((this.conatainer as any).el as HTMLElement).clientLeft;
    const top = ((this.conatainer as any).el as HTMLElement).clientTop;
    this.cropbox = { width, height, left, top } as Cropper.CropBoxData;
    console.log("crobocx:   ", this.cropbox);
    console.log("crobocx:   ", (this.conatainer as any));
  }

}
