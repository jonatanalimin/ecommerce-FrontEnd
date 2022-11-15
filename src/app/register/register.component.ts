import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoggedIn = false;
  isLoginFailed = false;
  username_: string = '';
  role: string = '';
  errorMessage: string ='';

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirm_password: ['', Validators.required]
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    if(this.storageService.isLoggedIn()){
      this.isLoggedIn = true;
      this.role = this.storageService.getUser().role;
      this.username_ = this.storageService.getUser().username;
    }
  }

  onSubmit(): void{
    this.register();
  }

  register(): void{
    this.errorMessage = '';
    let username_val: string;
    let password_val: string;
    console.log(this.registerForm.value.password);

    if(this.registerForm.value.password !== this.registerForm.value.confirm_password){
      this.errorMessage = "Confirm password must be same with password!";
      this.registerForm.reset();
      this.isLoginFailed = true;
    }else{
      if(typeof(this.registerForm.value.username)==='string' && typeof(this.registerForm.value.password)==='string'){
        username_val = this.registerForm.value.username;
        password_val = this.registerForm.value.password;
  
        this.userService.register(username_val, password_val)
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
          },
          error:(err) => {
            this.errorMessage = err.error.errorMessage;
            this.registerForm.reset();
            this.isLoginFailed = true;
          }
        })
      } 
    }
  }
}
