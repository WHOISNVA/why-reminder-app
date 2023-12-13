import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Output, EventEmitter  } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-userauth-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {
  @Output() changeLoginUserStatus: EventEmitter<any> = new EventEmitter();

  auth2: any;
  @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;

  authSubscription!: Subscription;
  
  loginForm: FormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
  });

  isLoggedIn = false;
  isLoginFailed = false;
  loginUserInfo = {
  }

  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private socialAuthService: SocialAuthService
  ) {
    
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  saveLoginUserData = (userData:any) => {
    if(userData !== null) {
      this.storageService.saveUser(userData);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.loginUserInfo = userData;
      this.snackbar.open('Login Successfull', 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })
    }
    this.changeLoginUserStatus.emit();
  }

  ngOnInit() { 
    this.authSubscription = this.socialAuthService.authState.subscribe(this.saveLoginUserData);
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.loginUserInfo = this.storageService.getUser();
      console.log(this.loginUserInfo);
    }
  } 

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }

  submitLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    //alert(JSON.stringify(this.loginForm.value));
    this.authService.login(this.loginForm.value).pipe(
      // route to protected/dashboard, if login was successfull
      tap(this.saveLoginUserData)
    ).subscribe();
  }

  submitLogout() {
    console.log('submit logout');
    this.storageService.clean();
    this.isLoggedIn = false;
    this.loginUserInfo = {};
    this.changeLoginUserStatus.emit();
    this.socialAuthService.signOut();
    this.authService.logout().pipe(
      tap(()=>{
        this.storageService.clean();
        this.isLoggedIn = false;
        this.loginUserInfo = {};

        this.changeLoginUserStatus.emit();
      })
    ).subscribe(
      res => {
        console.log(JSON.stringify(res))
      },
      err => {
        console.log(JSON.stringify(err));
        this.storageService.clean();
        this.isLoggedIn = false;
        this.loginUserInfo = {};
        this.loginUserInfo = {};
      },
      () => console.log('complete')
    );
  }
}