import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Output, Input, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { tap } from 'rxjs/operators';
import { GalleryService } from '../services/gallery.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectionListChange } from '@angular/material/list';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-usergallery',
  templateUrl: './usergallery.component.html',
  styleUrls: ['./usergallery.component.css']
})
export class UsergalleryComponent implements OnInit {
  @Output() changeGalleryInfo: EventEmitter<any> = new EventEmitter();
  @Input() currentGalleryInfo = {
    id:'',
    name:'',
  };
  @Input() currentUserInfo = {

  }

  createForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
  });
  
  galleryList = [
    {
      id: '',
      name: '',
    }
  ];

  galleryExpandStep = 2;

  constructor(
    private galleryService: GalleryService,
    private sanitizer: DomSanitizer, 
    private http: HttpClient, 
    private snackbar: MatSnackBar
  ) { }

  setExpandStep(num:number) {
    this.galleryExpandStep = num;
  }
  

  ngOnInit() {
    this.updateGalleryList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['currentUserInfo']) { 
      console.log('change', JSON.stringify(changes));
      this.updateGalleryList();
    }
  }

  updateGalleryList () {
    this.galleryList = [];
      const getUrl = environment.galleriesHandleUrl; // 'http://127.0.0.1:3000/galleries';
      this.http.get<any>(getUrl).subscribe(data => {
        this.setExpandStep(2); 
        data.map((d: any, index: number) => {
          this.galleryList.push({
            id: d._id,
            name: d.name,
          });
          })
        },
        err => {
          if(err.status === 401) {
            this.snackbar.open('Please login again!', 'Close', {
              duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snackbar-error']
            });
            
          }
        }
      );
  }

  selectChange(event:MatSelectionListChange) {
    console.log('select change:', event.options[0].value)
    this.changeGalleryInfo.emit(event.options[0].value);
  }

  createNewGallery() {
    if (!this.createForm.valid) {
      return;
    }
    this.galleryService.addGallery(this.createForm.value).pipe(
      // route to protected/dashboard, if login was successfull
      tap(() => {
        this.createForm.reset();
      }),

    ).subscribe(
      res => {
        const newGallery = {
          id: res._id,
          name: res.name,
        };
        this.galleryList.push(newGallery);
        this.setExpandStep(2); 
        this.changeGalleryInfo.emit(newGallery);
      },
      err => {
        console.log(JSON.stringify(err));
        this.snackbar.open('Failed to register', 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snackbar-error']
        })
      },
      () => console.log('complete')
    );
  }

  deleteCurrentGallery() {
    //const deleteUrl = 'http://127.0.0.1:3000/galleries/' + this.currentGalleryInfo.id;
    const deleteUrl = environment.galleriesHandleUrl + '/' + this.currentGalleryInfo.id;
    console.log(JSON.stringify(deleteUrl ));
    this.http.delete<any>(deleteUrl).subscribe(() => {
      console.log('Delete successful');
      this.RemoveElementFromGalleryList(this.currentGalleryInfo.id);
      this.changeGalleryInfo.emit({});
    });
  }

  RemoveElementFromGalleryList(id: string) {
    this.galleryList.forEach((value,index)=>{
        if(value.id==id) this.galleryList.splice(index,1);
    });
} 
}