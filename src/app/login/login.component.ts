import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../service/user.service';
import { FormBuilder, Validators, AbstractControl, AbstractControlOptions, FormControl, FormGroup } from '@angular/forms';
import { StorageService } from '../service/storage.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  processing = false;
  processing_edit = false;
  isLoggedIn = false;
  isLoginFailed = false;
  username_: string = '';
  role: string = '';
  errorMessage: string ='';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  oldPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
  ]);
  newPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
  ]);
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
  ]);
  chgPassForm = this.fb.group({
    oldPassword: this.oldPassword,
    newPassword: this.newPassword,
    confirmPassword: this.confirmPassword
  },
  {
    validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),
  } as AbstractControlOptions);
  id_:number = 0;
  title:string ="";
  body:string ="";
  editBox:any;
  @ViewChild('edit') editModal: ElementRef | undefined;
  @ViewChild('editInfo') infoModal: ElementRef | undefined;

  constructor(
    private modalService:NgbModal,
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
    this.processing = true;
    this.loginForm.get('username')?.disable();
    this.loginForm.get('password')?.disable();
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
          this.processing = false;
          this.loginForm.get('username')?.enable();
          this.loginForm.get('password')?.enable();
          console.log(response);
          this.storageService.saveUser(response);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          console.log(this.storageService.getUser());
          this.username_ = this.storageService.getUser().username;
          this.role = this.storageService.getUser().role;
          this.title = 'Login Success';
            this.body = 'You are logged as ' + this.username_;
            this.modalService.open(this.infoModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
              () => {window.location.replace('http://localhost:4200');}, () => {window.location.replace('http://localhost:4200');}
            );
        },
        error:(err) => {
          this.processing = false;
          this.loginForm.get('username')?.enable();
          this.loginForm.get('password')?.enable();
          if(err.status === 426){
            this.errorMessage = err.error.error;
            this.openEditBox(err.error.id);
          } else if(err.status === 0){
            this.errorMessage = err.message;
          } else {
            this.errorMessage = err.error.error;
          }
          this.loginForm.reset();
          this.isLoginFailed = true;
        }
      })
    }
  }

  openEditBox(id:number):void{
    this.id_ = id;
    this.chgPassForm.reset();
    this.editBox = this.modalService.open(this.editModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      () => { this.errorMessage = '';}, () => { this.errorMessage = '';});
  }

  onChange():void{
    if(typeof(this.chgPassForm.value.oldPassword)==='string' && typeof(this.chgPassForm.value.newPassword)==='string' && typeof(this.chgPassForm.value.confirmPassword)==='string'){
      this.processing_edit = true;
      this.chgPassForm.disable();
      this.userService.chgExpiryPass(this.id_, this.chgPassForm.value.newPassword, this.chgPassForm.value.oldPassword)
        .subscribe({
          next: (resp) => {
            this.processing_edit = false;
            this.chgPassForm.enable();
            this.editBox.close();
            this.errorMessage = '';
            this.title = 'Password Changed!';
            this.body = 'Your password has been changed! Please re-login!';
            this.modalService.open(this.infoModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
              () => {}, () => {}
            );
          },
          error: (err) => {
            this.processing_edit = false;
            this.chgPassForm.enable();
            if(err.status === 423){
              this.editBox.close();
              this.errorMessage = '';
              this.title = 'Your Account Locked!';
              this.body = 'Your account has been locked due to 3 failed attempts. It will be unlocked after 24 hours!';
              this.modalService.open(this.infoModal, { ariaLabelledBy: 'modal-basic-title' });
            }else if(err.status === 0){
              this.errorMessage = err.statusText;
            } else {
              this.errorMessage = err.error.error;
            }
            this.chgPassForm.reset();
          }
        })
    }
  }
}
