import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'why-reminder-app';

  constructor(private storageService: StorageService) {

  }

  currentUserInfo = {
    
  };

  changeLoginUserInfo() {
    this.currentUserInfo = this.storageService.getUser();
    //alert(JSON.stringify(this.currentUserInfo));
    //this.currentUserInfo.whiteboardname = 'newwhiteboard';
    //this.currentUserInfo.id = '333';
  }
}
