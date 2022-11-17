import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { FormBuilder, Validator, Validators } from '@angular/forms';
import { StorageService } from '../service/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  isLoginFailed = false;
  username_: string = '';
  role: string = '';
  errorMessage: string ='';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    if(this.storageService.isLoggedIn()){
      this.router.navigate(['']);
    }
  }

  onSubmit(): void{
    this.login();
  }

  login(): void{
    this.errorMessage = '';
    let username_val: string;
    let password_val: string;
    console.log(this.loginForm.value.password);
    if(typeof(this.loginForm.value.username)==='string' && typeof(this.loginForm.value.password)==='string'){
      username_val = this.loginForm.value.username;
      password_val = this.loginForm.value.password;

      this.userService.login(username_val, password_val)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.storageService.saveUser(response);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          console.log(this.storageService.getUser());
          this.username_ = this.storageService.getUser().username;
          this.role = this.storageService.getUser().role;
          window.location.reload();
          this.router.navigate(['']);
        },
        error:(err) => {
          if(err.status === 426){
            this.router.navigate(['change-expired-password']);
          }
          this.errorMessage = err.error.errorMessage;
          this.loginForm.reset();
          this.isLoginFailed = true;
        }
      })
    } 
  }

}
