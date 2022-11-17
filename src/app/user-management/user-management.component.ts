import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementGetAllResp } from '../model/user';
import { StorageService } from '../service/storage.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: UserManagementGetAllResp[] = [];
  username_selected: string = '';
  closeResult: string = "";
  title:string ="";
  body:string ="";
  @ViewChild('contentDel') mymodal: ElementRef | undefined;

  constructor(
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