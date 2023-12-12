import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { Output, Input, EventEmitter } from '@angular/core';

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

  currentGalleryInfo = {
    
  };

  changeLoginUserInfo() {
    this.currentUserInfo = this.storageService.getUser();
  }

  changeGalleryInfo(selectedGallery:any) {
    console.log(JSON.stringify(selectedGallery));
    this.currentGalleryInfo = selectedGallery;
  }
}
