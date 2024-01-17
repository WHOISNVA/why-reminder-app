import { Component, Input, SimpleChanges  } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { FileUploadComponent } from '../file-upload/file-upload.component'; 
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
//import { environment } from 'src/environments/environment';
import { environment } from '../../environments/environment';
import { FileUploadService } from '../file-upload.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})

export class WhiteboardComponent {
  @Input() currentGalleryInfo = {
    id:'',
  };

  mediaItems: { _id: string, src: string, safeSrc: SafeResourceUrl, x: number, y: number, type: string,}[] = [];
  showMediaForm = false;
  formPosition = { x: 0, y: 0 };
  formValue = { url: '' };
  dragging = false;

  // Variable to store uploading video files
  video_shortLink: string = ""; 
  video_loading: boolean = false; // Flag variable 
  video_file: File | null = null; // Variable to store file 
  video_uploadingprogress: number = 0; 

  constructor(private dialog: MatDialog, private sanitizer: DomSanitizer, private http: HttpClient, private snackbar: MatSnackBar, private storageService: StorageService, private fileUploadService: FileUploadService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.mediaItems = [];

    console.log("Whiteboard Current Gallery:", JSON.stringify(this.currentGalleryInfo));
    //const getUrl = 'http://127.0.0.1:3000/posts?gallery=' + this.currentGalleryInfo.id;
    const getUrl = environment.postsHandleUrl + '?gallery=' + this.currentGalleryInfo.id;
    
    this.http.get<any>(getUrl).subscribe(data => {
        data.map((d: any, index: number) => {
          const datatype = this.detectMediaType(d.url);
          if(datatype) {
            const safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(d.url);
            this.mediaItems.push({
              _id: d._id,
              x: d.x,
              y: d.y,
              src: d.url,
              safeSrc: safeURL,
              
              type: datatype
            });
            console.log(d);
          }
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

  ngOnInit(){
    
    //do any lines of code to init the child
    console.log("this executes second");
  }

  deleteMedia(mediaToDelete: any, event: MouseEvent): void {
    event.stopPropagation();
    this.mediaItems = this.mediaItems.filter(media => media !== mediaToDelete);

    //const deleteUrl = 'http://127.0.0.1:3000/posts/' + mediaToDelete._id;
    const deleteUrl = environment.postsHandleUrl + '/' + mediaToDelete._id;
    console.log(JSON.stringify(deleteUrl ));

    this.http.delete<any>(deleteUrl).subscribe(() => console.log('Delete successful'));
  }

  showForm(event: MouseEvent, source: 'background' | 'form' = 'background') {
    if(!this.dragging) {
      if (source === 'background') {
          this.formPosition.x = event.offsetX;
          this.formPosition.y = event.offsetY;
      } 
      this.showMediaForm = true;
    } else {
      this.dragging = false;
    }
  }

  openMedia(media: any, event: MouseEvent): void {
    event.stopPropagation(); // Prevent click from reaching the whiteboard
    if(!this.dragging) {
      if (media.type.startsWith('video')) {
        // Logic to open video in full screen
        this.openVideoDialog(media.safeSrc);
      }
    } else {
      this.dragging = false;
    }
  }

  openVideoDialog(url: string): void {
    this.dialog.open(VideoDialogComponent, {
      data: { url: url }
    });
  }

  addMediaURL() {
    if(this.video_loading === true) {
      alert('Cannot upload because of uploading video file!');
      return;
    }

    const type = this.detectMediaType(this.formValue.url);

    if (type) {
      const formattedURL = type.startsWith('video') ? this.formValue.url.replace('watch?v=', 'embed/') : this.formValue.url;
      const safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(formattedURL);
      
      // added for posting to backend server
      const postData = {
        url: formattedURL,
        x: this.formPosition.x,
        y: this.formPosition.y,
        galleryid: this.currentGalleryInfo.id,
      }

      console.log('post data:', JSON.stringify(postData));
      const postUrl = environment.postsHandleUrl;  // 'http://127.0.0.1:3000/posts';

      let postHeader = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(postUrl, JSON.stringify(postData), {headers:postHeader}).subscribe(
        data => {
          console.log('added data:', JSON.stringify(data));
          
          this.mediaItems.push({
            _id: '',
            src: formattedURL,
            safeSrc: safeURL,
            x: postData.x,
            y: postData.y,
            type,
          });
        },
        error => {
          if(this.mediaItems.length === 0) {
            this.mediaItems.push({
              _id: '',
              src: formattedURL,
              safeSrc: safeURL,
              x: postData.x,
              y: postData.y,
              type,
            });
          } else {
            this.snackbar.open('Please login and select a gallery for full-service.', 'Close', {
              duration: 4000, horizontalPosition: 'right', verticalPosition: 'top'
            })
          }
          
        }
      );
      
      this.showMediaForm = false;
      this.formValue = {  url: '' };
    } else {
      alert('Invalid URL!');
    }
  }

  // On file Select 
  onSelectVideoFile(event:any) { 
    this.video_file = event.target.files[0];
    if(this.video_file !== null && this.video_file !== undefined) {
      // uploading to the server
      this.video_loading = !this.video_loading; 
      this.fileUploadService.upload(this.video_file).subscribe( 
          (event: any) => { 
              //if (typeof (event) === 'object') { 
              if (event.type === HttpEventType.UploadProgress) {
                  console.log('event:', event);
                  this.video_uploadingprogress = Math.round(event.loaded * 100 / event.total * 100) / 100;
              } else if (event instanceof HttpResponse) {
                  console.log('event:', event);
                  // Short link via api response 
                  this.video_shortLink = environment.imageFolderUrl + '/' + event.body.uploadedname; 
                  this.video_loading = false; // Flag variable  
                  this.formValue.url = environment.imageFolderUrl + '/' + event.body.uploadedname; 
              } 
          } 
      ); 
    }
  }

  cancelUploadingVideoFile() {
    this.video_uploadingprogress = 0;
    this.video_loading = false;
  }
  
  hideForm(): void {
    this.showMediaForm = false;
  }

  detectMediaType(url: string): string | null {
    if (url.includes('youtube.com')) {
      return 'video/youtube';
    } else if( url.includes('png') || url.includes('PNG') ||
      url.includes('jpg') || url.includes('JPG') ||
      url.includes('jpeg') || url.includes('JPEG') || 
      url.includes('bmp') || url.includes('BMP') ||
      url.includes('gif') || url.includes('GIF') ||
      url.includes('tiff') || url.includes('tif')) {
      return 'imagefile';
    }
    // You can add more media type detections if needed
    return null;
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }


  cancelForm() {
    this.showMediaForm = false;
    this.formValue = { url: '' };
  }

  onDrag(media: any, event: CdkDragStart): void {
    this.dragging = true;
    this.showMediaForm = false;
    console.log(event.source.getFreeDragPosition());
  }

  onDrop(mediaToUpdate: any, event: CdkDragEnd): void {    
    let tmpMedia = {...mediaToUpdate};
    const movedPositionDiff = event.source.getFreeDragPosition();
    //const updateUrl = 'http://127.0.0.1:3000/posts/' + mediaToUpdate._id;
    const updateUrl = environment.postsHandleUrl +  '/' + mediaToUpdate._id;
    
    tmpMedia.x += movedPositionDiff.x;
    tmpMedia.y += movedPositionDiff.y;
    
    this.http.put<any>(updateUrl, tmpMedia)
        .subscribe(data => { 
          mediaToUpdate._id = data._id;
        });
  }
}
