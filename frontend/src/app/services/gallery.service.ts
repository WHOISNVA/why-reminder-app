import { LOCALSTORAGE_TOKEN_KEY } from './../app.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap, catchError, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddgalleryRequest, AddgalleryResponse } from '../interfaces';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GalleryService {
    constructor(
        private http: HttpClient,
        private snackbar: MatSnackBar,
      ) { }

    // Add a gallery
    addGallery(addgalleryRequest: AddgalleryRequest): Observable<AddgalleryResponse> {
        // TODO
        const postUrl = environment.galleriesHandleUrl;  // 'http://127.0.0.1:3000/galleries';
        return this.http.post<AddgalleryResponse>(postUrl, addgalleryRequest).pipe(
            tap((res: AddgalleryResponse) => {
                this.snackbar.open(`A new gallery is created successfully`, 'Close', {
                duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snackbar-success']
                });
            })
        )
    }

    
}
