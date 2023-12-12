import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../custom-validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-userauth-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, [Validators.required]),
    firstname: new FormControl(null, [Validators.required]),
    lastname: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirm: new FormControl(null, [Validators.required]),
  },
    // add custom Validators to the form, to make sure that password and passwordConfirm are equal
    { validators: CustomValidators.passwordsMatching }
  )

  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() { 
    
  }

  submitRegister() {

    if (!this.registerForm.valid) {
      return;
    }
    this.authService.register(this.registerForm.value).pipe(
      // route to protected/dashboard, if login was successfull
      tap(() => {
        
      }),

    ).subscribe(
      res => {
        console.log(JSON.stringify(res))
      },
      err => {
        console.log(JSON.stringify(err));
        this.snackbar.open('Failed to register', 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snackbar-error']
        })
      },
      () => console.log('complete')
    );
  }
}