import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { FormBuilder, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string='';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
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
        },
        error:(err) => {
          this.errorMessage = err.error.errorMessage;
          this.loginForm.reset();
        }
      })
    } 
  }

}
