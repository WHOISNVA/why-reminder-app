import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})

export class WhiteboardComponent {
  mediaItems: { src: string, safeSrc: SafeResourceUrl, x: number, y: number, type: string, name: string }[] = [];
  showMediaForm = false;
  formPosition = { x: 0, y: 0 };
  formValue = { name: '', url: '' };

  showForm(event: MouseEvent, source: 'background' | 'form' = 'background') {
    if (source === 'background') {
        console.log('Whiteboard clicked');
        this.formPosition.x = event.offsetX;
        this.formPosition.y = event.offsetY;
    }
    this.showMediaForm = true;
}


  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  addMedia() {
    const type = this.detectMediaType(this.formValue.url);
    if (type) {
      const formattedURL = type.startsWith('video') ? this.formValue.url.replace('watch?v=', 'embed/') : this.formValue.url;
      const safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(formattedURL);
      this.mediaItems.push({
        src: formattedURL,
        safeSrc: safeURL,
        x: this.formPosition.x,
        y: this.formPosition.y,
        type,
        name: this.formValue.name
      });

      // added for posting to backend server
      
      const postData = {
        title: this.formValue.name,
        url: formattedURL,
        x: this.formPosition.x,
        y: this.formPosition.y,
      }

      console.log('post data:', JSON.stringify(postData));
      const postUrl = 'http://127.0.0.1:3000/posts';
           

      let postHeader = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(postUrl, JSON.stringify(postData), {headers:postHeader}).subscribe(data => {
        //alert(JSON.stringify(data));
      });
      

      this.showMediaForm = false;
      this.formValue = { name: '', url: '' };
    } else {
      alert('Invalid URL!');
    }
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
    this.formValue = { name: '', url: '' };
  }
}
