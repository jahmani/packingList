import {
  Component, OnInit, ViewChild, ElementRef, ViewEncapsulation,
  Input, OnChanges, SimpleChanges, AfterContentChecked, AfterContentInit, Sanitizer
} from '@angular/core';
import Cropper from "cropperjs";
import { ImageSaveInfo } from '../../interfaces/data-models';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.page.html',
  styleUrls: ['./edit-photo.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EditPhotoPage {


  @ViewChild("image") img: ElementRef;
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("previewContainer") previewContainer: ElementRef;

  ready: boolean;
  imgQuality = 0.8;
  showQualityRange = false;
  previewVisable = false;
  _imageSaveInfo: ImageSaveInfo;
  @Input() set imgInfo(val: ImageSaveInfo) {
    //    this.image.src = val.imageString;
    if (val) {
      this._imageSaveInfo = { ...val };
      this.image.src = val.blobURL;
      this.ready = false;
    }
  }


  get image(): HTMLImageElement {
    return this.img.nativeElement;
  }
  cropper: Cropper;
  uploadedImageURL: any;

  constructor(
    public modalController: ModalController,
    private sanitizer: DomSanitizer

  ) {
    this.showQualityRange = !environment.production;

  }

  onImageLoaded() {
    this.setupCropper();
  }
  // onEdit() {
  //   this.setupCropper();
  // }
  // onCancelEdit() {
  //   if (this.cropper) {
  //     this.cropper.destroy();
  //   }
  // }
  // upload(){

  // }
  setupCropper() {
    this.ready = false;
    this.previewVisable = false;
    const self = this;
    setTimeout(() => {
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.cropper = new Cropper(this.image, {
        movable: false,
        zoomable: true,
        rotatable: true,
        scalable: false,
        viewMode: 2, autoCrop: false,
        ready() { self.ready = true; self.preview(); },
        //  preview: ".preview"
      });
      // this.cropper.
    }, 100);
  }
  edit() {
    const previewContainerNode = this.previewContainer.nativeElement as Node;
    this.previewVisable = false;
    //  this.setupCropper();

  }
  preview() {
    const croppedCanava = this.cropper.getCroppedCanvas();
    croppedCanava.style.width = "100%";
    const previewContainerNode = this.previewContainer.nativeElement as Node;
    const firstChild = previewContainerNode.firstChild;
    if (firstChild) {
      previewContainerNode.replaceChild(croppedCanava, firstChild);

    } else {
      this.previewContainer.nativeElement.appendChild(croppedCanava);

    }
    this.previewVisable = true;

    // this.p
  }
  openNativeFileInput() {
    this.fileInput.nativeElement.click();
  }

  async upload() {
    // this.cropper.se
    const croppedCanava = this.cropper.getCroppedCanvas({ maxWidth: 1024 });
 //   const croppedThumbCanvas = this.cropper.getCroppedCanvas({ maxWidth: 1024 });

    // const croppedThumbPromise = new Promise<Blob>(resolve => croppedThumbCanvas.toBlob(resolve, "image/jpeg", this.imgQuality));
    const croppedBlobPromise = new Promise<Blob>(resolve => croppedCanava.toBlob(resolve, "image/jpeg", this.imgQuality));
    const croppedBlob = await croppedBlobPromise;
    const editedBlobUrl = URL.createObjectURL(croppedBlob);
    // const croppedThumb = await croppedThumbPromise;
    // const thumbBlobUrl = URL.createObjectURL(croppedThumb);
    const safeThumbBlobUrl = this.sanitizer.bypassSecurityTrustUrl(editedBlobUrl);

    //  const imageString = croppedCanava.toDataURL("image/jpeg", this.imgQuality);
    const size = croppedBlob.size; // this.getImageSize(imageString);
    // const thumbString = croppedThumbCanvas.toDataURL("image/jpeg", this.imgQuality);
    // const thumbSize = croppedThumb.size; // this.getImageSize(thumbString);
    // this.imageCropper.exportCanvas(true);
    // this.imageCropper.export.subscribe((data) => {
    //   this.imgInfo.imageString = data.dataUrl;
    //   console.log(data.dataUrl);
    // this.imgInfo.imageString = imageString;
    const height = croppedCanava.height;
    const width = croppedCanava.width;
    // const thumbHeight = croppedThumbCanvas.height;
    // const thumbWidth = croppedThumbCanvas.width;
    const imgInfo: ImageSaveInfo = {
      ...this._imageSaveInfo,
      // imageString, thumbString,
      height, width,
      size, editedBlobUrl,
       // thumbBlobUrl, thumbSize, thumbHeight, thumbWidth,
       safeBlobUrl: safeThumbBlobUrl
    } as ImageSaveInfo;
    const role = "upload";
    this.modalController.dismiss(imgInfo, role);
    URL.revokeObjectURL(this.image.src);


  }
  // private getImageSize(data_url) {
  //   const head = "data:image/jpeg;base64,";
  //   return ((data_url.length - head.length) * 3) / 4 / (1024 * 1024);
  //   console.warn("WRONG SIZE ", "getImageSize(data_url)");
  // }
  onQualityChanged($event) {
    const val = $event.detail.value;
    this.imgQuality = val;
    console.log(val);

  }
  onFileInpuChanged(event) {
    event.stopPropagation();
    this.ready = false;
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
          this.setupCropper();
          this.fileInput.nativeElement.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    } else {
      this.fileInput.nativeElement.disabled = true;
      this.fileInput.nativeElement.parentNode.className += ' disabled';
    }

  }

  rotate() {
    if (this.cropper) {
      this.cropper.clear();
      this.cropper.rotate(90);
      this.cropper.zoom(-1);
    }
  }



  close() {
    this.modalController.dismiss(this.imgInfo);
    URL.revokeObjectURL(this.image.src);
  }
}
