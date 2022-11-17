import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementGetAllResp } from '../model/user';
import { StorageService } from '../service/storage.service';
import { UserService } from '../service/user.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  user_modal?: UserManagementGetAllResp;
  user_: UserManagementGetAllResp = {
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
  users: UserManagementGetAllResp[] = [];
  username_selected: string = '';
  closeResult: string = "";
  title:string ="";
  body:string ="";
  editForm = this.fb.group({
    role: ['user', Validators.required],
    enabled: [false, Validators.required],
    locked: [false, Validators.required],
  });
  editBox: any;
  @ViewChild('edit') editModal: ElementRef | undefined;
  @ViewChild('info') infoModal: ElementRef | undefined;
  @ViewChild('contentDel') mymodal: ElementRef | undefined;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private storageService: StorageService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    const username_ = this.storageService.getUser().username;
    this.userService.getAll(this.storageService.getUser().auth)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          resp.forEach(element => {
            if(element.username !== username_){
              this.users.push(element);
            }
          });
        },
        error:(err) => (console.error(err))
      })
  }

  onEdit(user:UserManagementGetAllResp): void{
    this.user_ = user;
    this.editForm.setValue({
      role: this.user_.role,
      enabled: this.user_.enabled,
      locked: this.user_.locked
    })
    this.editBox = this.modalService.open(this.editModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(): void{
    if(typeof(this.editForm.value.role) === 'string' && typeof(this.editForm.value.enabled) === 'boolean' && typeof(this.editForm.value.locked) === 'boolean'){
      this.user_.role = this.editForm.value.role;
      this.user_.enabled = this.editForm.value.enabled;
      this.user_.locked = this.editForm.value.locked;

      this.userService.update(this.storageService.getUser().auth, this.user_)
          .subscribe({
            next: (resp) => {
              console.log(resp);
              this.editBox.close();
              this.title = "Succes Edit Data";
              this.body = "";
              this.user_modal = resp;
              this.modalService.open(this.infoModal, { ariaLabelledBy: 'modal-basic-title' });
            },
            error: (err) => {
              this.editBox.close();
              this.title = "Failed Edit Data";
              this.body = err.message;
              this.modalService.open(this.infoModal, { ariaLabelledBy: 'modal-basic-title' });
            }
        })
    }
  }

  delete(content:any, user_:UserManagementGetAllResp): void{
    const username_ = this.storageService.getUser().username;
    this.username_selected = user_.username;
    const modalDelete = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    modalDelete.result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {
        this.userService.delete(this.storageService.getUser().auth, user_.id)
          .subscribe({
            next: () => {
              this.title = "Succes Delete";
              this.body = `Success delete data ${this.username_selected}`;
              this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
                () => {
                  this.userService.getAll(this.storageService.getUser().auth)
                    .subscribe({
                      next: (resp) => {
                        console.log(resp);
                        this.users = [];
                        resp.forEach(element => {
                          if(element.username !== username_){
                            this.users.push(element);
                          }
                        });
                      },
                      error:(err) => (console.error(err))
                    });
                }, () => {
                  this.userService.getAll(this.storageService.getUser().auth)
                    .subscribe({
                      next: (resp) => {
                        console.log(resp);
                        this.users = [];
                        resp.forEach(element => {
                          if(element.username !== username_){
                            this.users.push(element);
                          }
                        });
                      },
                      error:(err) => (console.error(err))
                    });
                }
              )
            },
            error: (err) => {
              this.title = "Failed Delete";
              this.body = err.message;
              this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' })
            }
        }) 
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });
  }

  private getDismissReason(reason: any): string {  
    if (reason === ModalDismissReasons.ESC) {  
      return 'by pressing ESC';  
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {  
      return 'by clicking on a backdrop';  
    } else {  
      return `with: ${reason}`;  
    }  
  }  
}