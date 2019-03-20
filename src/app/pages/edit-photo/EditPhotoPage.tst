import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation,
     Input, OnChanges, SimpleChanges, AfterContentChecked, AfterContentInit } from '@angular/core';
import Cropper from "cropperjs";
import { ImageSaveInfo } from '../../interfaces/data-models';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.page.html',
  styleUrls: ['./edit-photo.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditPhotoPage implements OnInit, OnChanges, AfterContentChecked, AfterContentInit {

  @ViewChild("inputImage")
  inputImage: ElementRef;
  @ViewChild("image")
  img: ElementRef;
  @Input()
  set imgInfo(val: ImageSaveInfo) {
    this.image.src = val.imageString;
    // if (this.cropper) {
    //   this.cropper.destroy();
    // }
    // this.cropper = new Cropper(this.image, {
    //   movable: false,
    //   zoomable: true,
    //   rotatable: true,
    //   scalable: false,
    //   viewMode: 2,
    // });
  }
  get image(): HTMLImageElement {
    return this.img.nativeElement;
  }
  cropper: Cropper;
  uploadedImageURL: any;
  constructor(
      public modalController: ModalController
  ) { }
  onImageLoaded() {
    if (this.cropper) {
      this.cropper.destroy();
    }
    this.cropper = new Cropper(this.image, {
      movable: false,
      zoomable: true,
      rotatable: true,
      scalable: false,
      viewMode: 2,
    });
  }
  ngAfterContentChecked(): void {
    console.warn("Method not implemented.");
  }
  ngAfterContentInit(): void {
    console.warn("Method not implemented.");
}
  ngOnChanges(changes: SimpleChanges) {
    const chng = changes['imgInfo'];
    if (chng) {
      this.image.src = this.imgInfo.imageString;
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.cropper = new Cropper(this.image, {
        movable: false,
        zoomable: true,
        rotatable: true,
        scalable: false,
        viewMode: 2,
      });
    }
  }
  onFileInpuChanged(event) {
    event.stopPropagation();
    // Import image
    if (URL) {
      const files = event.target.files;
      let file;
      if (Cropper && files && files.length) {
        file = files[0];
        if (/^image\/\w+/.test(file.type)) {
          const uploadedImageType = file.type;
          const uploadedImageName = file.name;
          if (this.uploadedImageURL) {
            URL.revokeObjectURL(this.uploadedImageURL);
          }
          this.image.src = this.uploadedImageURL = URL.createObjectURL(file);
          if (this.cropper) {
            this.cropper.destroy();
          }
          this.cropper = new Cropper(this.image, {
            movable: false,
            zoomable: true,
            rotatable: true,
            scalable: false,
            viewMode: 2,
          });
          this.inputImage.nativeElement.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    } else {
      this.inputImage.nativeElement.disabled = true;
      this.inputImage.nativeElement.parentNode.className += ' disabled';
    }
  }
  rotate() {
    if (this.cropper) {
      this.cropper.clear();
      this.cropper.rotate(90);
      this.cropper.zoom(-1);
    }
  }
  done() {
    const croppedCanava = this.cropper.getCroppedCanvas();
    // croppedCanava.toBlob((blob) => {
    //   const url = URL.createObjectURL(blob);
    //   const dataUrl = url; // this.sanitizer.bypassSecurityTrustUrl(url);
    //   this.modalController.dismiss(dataUrl);

    // });
    // console.log("dataurl,", dataUrl);
     const imageString = croppedCanava.toDataURL("image/png", 0.7);
    // this.imageCropper.exportCanvas(true);
    // this.imageCropper.export.subscribe((data) => {
    //   this.imgInfo.imageString = data.dataUrl;
    //   console.log(data.dataUrl);
    // this.imgInfo.imageString = imageString;
      this.modalController.dismiss({imageString});

    }



  close() {
      this.modalController.dismiss(this.imgInfo);
  }
  ngOnInit() {
  }
}
