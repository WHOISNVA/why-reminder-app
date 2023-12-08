import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule  } from "@angular/forms";
import { AppComponent } from './app.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafePipe } from './safe.pipe';
import { TitleComponent } from './title/title.component';
import { HttpClientModule } from '@angular/common/http';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    AppComponent,
    WhiteboardComponent,
    SafePipe,
    TitleComponent,
    VideoDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
