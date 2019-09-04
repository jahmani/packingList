import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Renderer2, Output, EventEmitter } from '@angular/core';
import { link } from 'fs';

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss']
})
export class ExpandableComponent implements AfterViewInit {

  @ViewChild("expandWrapper", { read: ElementRef, static: true }) expandWrapper: ElementRef;
  @Input() expanded = false;
  @Input() expandHeight = "150px";
  // @Input() link: string;
  @Output() linkClick = new  EventEmitter();
  @Output() contentClick = new EventEmitter();

  constructor(public renderer: Renderer2) {}

  ngAfterViewInit() {
    this.renderer.setStyle(this.expandWrapper.nativeElement, "max-height", this.expandHeight);
  }
}
