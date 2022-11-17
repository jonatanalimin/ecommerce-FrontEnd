import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserManagementGetAllResp } from '../model/user';
import { StorageService } from '../service/storage.service';
import { UserService } from '../service/user.service';
import { FormControl,AbstractControl, FormBuilder, FormGroup, AbstractControlOptions, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../service/spinner.service';

@Component({
  selector: 'app-biodata',
  templateUrl: './biodata.component.html',
  styleUrls: ['./biodata.component.css']
})
export class BiodataComponent implements OnInit {
  empty: boolean = false;
  processing = false;
  user: UserManagementGetAllResp = {
    id:0,
    username: '',
    password: '',
    role: '',
    enabled: false,
    passwordChangedTime: new Date(),
    failedAttempt: 0,
    locked: false,
    lockTime: new Date()
  };
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
  chgBox:any;
  @ViewChild('changePassword') chgModal: ElementRef | undefined;
  @ViewChild('contentInfo') infoModal: ElementRef | undefined;

  constructor(
    private spinnerService: SpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private storageService : StorageService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.requestStarted();
    this.userService.getById(this.storageService.getUser().auth, this.storageService.getUser().id)
      .subscribe({
        next: (resp) => {
          this.spinnerService.requestEnded();
          this.empty = false;
          this.user = resp;
        },
        error: (err) => {
          this.empty = true;
          this.spinnerService.resetSpinner();
        }
      })
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

  showChgPass():void{
    this.chgPassForm.reset();
    this.chgBox = this.modalService.open(this.chgModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit():void{
    if(typeof(this.chgPassForm.value.oldPassword)==='string' && typeof(this.chgPassForm.value.newPassword)==='string' && typeof(this.chgPassForm.value.confirmPassword)==='string'){
      this.processing=true;
      this.chgPassForm.disable();
      this.userService.chgPass(this.storageService.getUser().id, this.chgPassForm.value.newPassword, this.chgPassForm.value.oldPassword)
        .subscribe({
          next: (resp) => {
            this.processing=false;
            this.chgPassForm.enable();
            this.chgBox.close();
            this.storageService.saveUser(resp);
            this.title = 'Password Changed!';
            this.body = 'Your password has been changed!';
            this.modalService.open(this.infoModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
              () => {
                window.location.reload();
              }, () => {
                window.location.reload();
              }
            );
          },
          error: (err) => {
            this.processing=false;
            this.chgPassForm.enable();
            if(err.status === 423){
              this.chgBox.close();
              this.title = 'Your Account Locked!';
              this.body = 'Your account has been locked due to 3 failed attempts. It will be unlocked after 24 hours!';
              this.modalService.open(this.infoModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
                () => {
                  this.storageService.clean();
                  window.location.replace('http://localhost:4200/login');
                }, () => {
                  this.storageService.clean();
                  window.location.replace('http://localhost:4200/login');
                }
              );
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
