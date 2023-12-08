import { Component } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {
  whiteboardName: string = '';


  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }


}

