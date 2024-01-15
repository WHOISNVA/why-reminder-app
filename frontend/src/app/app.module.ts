import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafePipe } from './safe.pipe';
import { TitleComponent } from './title/title.component';
import { UserauthComponent } from './userauth/userauth.component';
import { SigninComponent } from './userauth/signin/signin.component';
import { GoogleSigninComponent } from './userauth/signin/googlesignin/googlesignin.component';
import { SignupComponent } from './userauth/signup/signup.component';
import { UsergalleryComponent } from './usergallery/usergallery.component';

import { AuthInterceptor } from './http-interceptors/auth-interceptor';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { JwtModule } from '@auth0/angular-jwt';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { FileUploadComponent } from './file-upload/file-upload.component';

// specify the key where the token is stored in the local storage
export const LOCALSTORAGE_TOKEN_KEY = 'angular_material_login_and_register_example';

// specify tokenGetter for the angular jwt package
export function tokenGetter() {
  return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
}

@NgModule({
  declarations: [
    AppComponent,
    WhiteboardComponent,
    ToolbarComponent,
    SafePipe,
    TitleComponent,
    VideoDialogComponent,
    UserauthComponent,
    SigninComponent,
    GoogleSigninComponent,
    SignupComponent,
    UsergalleryComponent,
    FileUploadComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    DragDropModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule, 
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    // Angular Material Imports
    MatSnackBarModule,
    MatTabsModule,
    MatListModule,
    MatExpansionModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000', 'localhost:8080']
      }
    }),

    SocialLoginModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
//            provider: new GoogleLoginProvider('261646635303-pr2kkfuepifg8jii5hn4tp6919oho6eg.apps.googleusercontent.com', {
            provider: new GoogleLoginProvider('172763903889-cq4o1vorteqhvvn67h0kkeklrrhr9208.apps.googleusercontent.com', {
              scopes: 'openid profile email',
            }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
