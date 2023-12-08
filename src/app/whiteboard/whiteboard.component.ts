import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';


@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})

export class WhiteboardComponent {
  mediaItems: { _id: string, src: string, safeSrc: SafeResourceUrl, x: number, y: number, type: string,}[] = [];
  showMediaForm = false;
  formPosition = { x: 0, y: 0 };
  formValue = { url: '' };

  ngOnInit(){
    
    //do any lines of code to init the child
    console.log("this executes second");
    
    const getUrl = 'http://127.0.0.1:3000/posts';
    //let postHeader = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.get<any>(getUrl).subscribe(data => {
      data.map((d: any, index: number) => {
        const datatype = this.detectMediaType(d.url);
        console.log(JSON.stringify(d));
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
          //console.log(datatype);
        }
        
      })
    });

  }

  deleteMedia(mediaToDelete: any, event: MouseEvent): void {
    event.stopPropagation();
    this.mediaItems = this.mediaItems.filter(media => media !== mediaToDelete);

    const deleteUrl = 'http://127.0.0.1:3000/posts/' + mediaToDelete._id;
    console.log(JSON.stringify(deleteUrl ));

    this.http.delete<any>(deleteUrl).subscribe(() => console.log('Delete successful'));
}


  showForm(event: MouseEvent, source: 'background' | 'form' = 'background') {
    if (source === 'background') {
        console.log('Whiteboard clicked');
        this.formPosition.x = event.offsetX;
        this.formPosition.y = event.offsetY;
    } 
    this.showMediaForm = true;
  }

  openMedia(media: any, event: MouseEvent): void {
    console.log('openMedia');
    console.log(media);
    
    event.stopPropagation(); // Prevent click from reaching the whiteboard
    if (media.type.startsWith('video')) {
      // Logic to open video in full screen
      this.openVideoDialog(media.safeSrc);
    }
    
  }

  openVideoDialog(url: string): void {
    this.dialog.open(VideoDialogComponent, {
      data: { url: url }
    });
  }

  constructor(private dialog: MatDialog, private sanitizer: DomSanitizer, private http: HttpClient) {}

  addMedia() {
    const type = this.detectMediaType(this.formValue.url);
    if (type) {
      const formattedURL = type.startsWith('video') ? this.formValue.url.replace('watch?v=', 'embed/') : this.formValue.url;
      const safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(formattedURL);
      

      // added for posting to backend server
      const postData = {
        url: formattedURL,
        x: this.formPosition.x,
        y: this.formPosition.y,
      }

      console.log('post data:', JSON.stringify(postData));
      const postUrl = 'http://127.0.0.1:3000/posts';
           

      let postHeader = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(postUrl, JSON.stringify(postData), {headers:postHeader}).subscribe(data => {
        console.log('added data:', JSON.stringify(data));
        
        this.mediaItems.push({
          _id: '',
          src: formattedURL,
          safeSrc: safeURL,
          x: postData.x,
          y: postData.y,
          type,
        });

      });
      
      this.showMediaForm = false;
      this.formValue = {  url: '' };
    } else {
      alert('Invalid URL!');
    }
  }
  
  hideForm(): void {
    this.showMediaForm = false;
  }

  detectMediaType(url: string): string | null {
    if (url.includes('youtube.com')) {
      return 'video/youtube';
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
}
