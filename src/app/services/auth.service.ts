import { LOCALSTORAGE_TOKEN_KEY } from './../app.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap, catchError, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../interfaces';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';

export const fakeLoginResponse: LoginResponse = {
  // fakeAccessToken.....should all come from real backend
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  refreshToken: {
    id: 1,
    userId: 2,
    token: 'fakeRefreshToken...should al come from real backend',
    refreshCount: 2,
    expiryDate: new Date(),
  },
  tokenType: 'JWT'
}

export const fakeRegisterResponse: RegisterResponse = {
  status: 200,
  message: 'Registration sucessfull.'
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private jwtService: JwtHelperService,

  ) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    const authUrl = environment.authLoginUrl; //'http://127.0.0.1:3000/login';
    return this.http.post<LoginResponse>(authUrl, loginRequest).pipe(
       tap((res: LoginResponse) => {
        //window.alert(JSON.stringify(res));
        //localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken);
        
       }),
       tap(() => {})
      );

  }

  /*
   The `..of()..` can be removed if you have a real backend, at the moment, this is just a faked response
  */
  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    // TODO
    const postUrl = environment.usersHandleUrl;  // 'http://127.0.0.1:3000/users';
    return this.http.post<RegisterResponse>(postUrl, registerRequest).pipe(
      tap((res: RegisterResponse) => {
        this.snackbar.open(`User created successfully`, 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snackbar-success']
        });
      })
    )
  }

  logout() {
    const logoutUrl = environment.authLogoutUrl;  //'http://127.0.0.1:3000/logout';
    return this.http.post(logoutUrl, {}).pipe(
      tap(() => {
        console.log('tap logout');
      })
    );
  }

  /*
   Get the user fromt the token payload
   */
  getLoggedInUser() {
    const decodedToken = this.jwtService.decodeToken();
    return decodedToken.user;
  }
}