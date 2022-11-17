import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl, AbstractControlOptions } from '@angular/forms';
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
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
  ]);

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirm_password: this.confirmPassword
  }, {
    validator: this.ConfirmedValidator('password', 'confirm_password'),
  } as AbstractControlOptions);

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

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
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
            if(typeof(err.error.error) === 'object'){
              this.errorMessage = err.error.error.message;
            }else{
              this.errorMessage = err.error.error;
            }
            this.registerForm.reset();
            this.isLoginFailed = true;
          }
        })
      } 
    }
  }
}
