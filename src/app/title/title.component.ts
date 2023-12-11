import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {
  @Input() currentUserInfo = {
    whiteboardname: ''
  };
  whiteboardname = '';

  showMenu = false;

  ngOnChanges(changes: SimpleChanges) {

    if (Object.keys(this.currentUserInfo).length > 0) {
      this.whiteboardname = this.currentUserInfo.whiteboardname;
    } else {
      this.currentUserInfo = {
        whiteboardname: ''
      };
    }
    this.whiteboardname = this.currentUserInfo.whiteboardname;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }


}

