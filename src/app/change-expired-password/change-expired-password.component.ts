import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Buffer } from 'buffer';
import { FormBuilder, Validators, AbstractControl, FormGroup, FormControl, AbstractControlOptions } from '@angular/forms';
import { UserService } from '../service/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-expired-password',
  templateUrl: './change-expired-password.component.html',
  styleUrls: ['./change-expired-password.component.css']
})
export class ChangeExpiredPasswordComponent implements OnInit {
  id: number = 0;
  activated: boolean = false;
  errorMessage:string = '';
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
  title:string ="";
  body:string ="";
  @ViewChild('contentInfo') mymodal: ElementRef | undefined;
  

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get("id");
    if(typeof(param) === 'string'){
      this.id = Number(Buffer.from(param, 'base64').toString('ascii'));
      this.activated = true;
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

  onSubmit():void{
    if(typeof(this.chgPassForm.value.oldPassword)==='string' && typeof(this.chgPassForm.value.newPassword)==='string' && typeof(this.chgPassForm.value.confirmPassword)==='string'){
      this.userService.chgExpiryPass(this.id, this.chgPassForm.value.newPassword, this.chgPassForm.value.oldPassword)
        .subscribe({
          next: (resp) => {
            this.title = 'Password Changed!';
            this.body = 'Your password has been changed! Please re-login!';
            this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
              () => {}, () => {}
            );
            this.router.navigate(['login']);
          },
          error: (err) => {
            console.log(err);
            if(err.status === 423){
              this.title = 'Your Account Locked!';
              this.body = 'Your account has been locked due to 3 failed attempts. It will be unlocked after 24 hours!';
              this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
                () => {}, () => {}
              );
              this.router.navigate(['login']);
            }else{
              if(typeof(err.error.error) === 'object'){
                this.errorMessage = err.error.error.message;
              }else{
                this.errorMessage = err.error.error;
              }
            }
            this.chgPassForm.reset();
          }
        })
    }
  }

}
