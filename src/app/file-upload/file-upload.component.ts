import { Component, OnInit } from '@angular/core'; 
import { FileUploadService } from '../file-upload.service'; 

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit { 
  
  // Variable to store shortLink from api response 
  video_shortLink: string = ""; 
  video_loading: boolean = false; // Flag variable 
  video_file: File | null = null; // Variable to store file 

  // Inject service  
  constructor(private fileUploadService: FileUploadService) { } 

  ngOnInit(): void { 
  } 

  // On file Select 
  onSelectVideoFile(event:any) { 
      this.video_file = event.target.files[0];
      if(this.video_file != null && this.video_file != undefined) {
        // uploading to the server
        this.video_loading = !this.video_loading; 
        console.log(this.video_file); 
        this.fileUploadService.upload(this.video_file).subscribe( 
            (event: any) => { 
                if (typeof (event) === 'object') { 

                    // Short link via api response 
                    this.video_shortLink = event.link; 
                    this.video_loading = false; // Flag variable  
                } 
            } 
        ); 
      }
  }

  onClickReselectVideoFile() {
    this.video_file = null;
    this.video_shortLink = "";
    this.video_loading = false;
  }

} 