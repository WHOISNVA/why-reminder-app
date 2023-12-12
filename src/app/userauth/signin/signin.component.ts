import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter  } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-userauth-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @Output() changeLoginUserStatus: EventEmitter<any> = new EventEmitter();

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
    private storageService: StorageService
  ) {
    
  }

  ngOnInit() { 
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.loginUserInfo = this.storageService.getUser();
      console.log(this.loginUserInfo);
    }
  } 

  submitLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    //alert(JSON.stringify(this.loginForm.value));
    this.authService.login(this.loginForm.value).pipe(
      // route to protected/dashboard, if login was successfull
      tap((userData) => {
        this.storageService.saveUser(userData);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.loginUserInfo = userData;

        this.changeLoginUserStatus.emit();
      })
    ).subscribe();
  }

  submitLogout() {
    console.log('submit logout');
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