import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {
  @Input() currentGalleryInfo = {
    name: ''
  };
  whiteboardname = '';

  showMenu = false;

  ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(this.currentGalleryInfo).length > 0) {
      this.whiteboardname = this.currentGalleryInfo.name;
    } else {
      this.currentGalleryInfo = {
        name: ''
      };
    }
    this.whiteboardname = this.currentGalleryInfo.name;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }


}

