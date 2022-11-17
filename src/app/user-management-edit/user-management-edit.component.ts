import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementGetAllResp } from '../model/user';
import { StorageService } from '../service/storage.service';
import { UserService } from '../service/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-management-edit',
  templateUrl: './user-management-edit.component.html',
  styleUrls: ['./user-management-edit.component.css']
})
export class UserManagementEditComponent implements OnInit {
  title:string = "";
  body:string = "";
  user_modal?: UserManagementGetAllResp;
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
  empty: boolean = true;
  @ViewChild('content') mymodal: ElementRef | undefined;

  editForm = this.fb.group({
    username: ['', Validators.required],
    role: ['user', Validators.required],
    enabled: [false, Validators.required],
    locked: [false, Validators.required],
  });

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userService.getById(this.storageService.getUser().auth, Number(this.activatedRoute.snapshot.paramMap.get("id")))
      .subscribe({
        next: (resp) => {
          this.empty = false;
          this.user = resp;
          this.editForm.setValue({
            username: resp.username,
            role: resp.role,
            enabled: resp.enabled,
            locked: resp.locked
          })
        },
        error: (err) => console.error(err)
      })
  }

  onSubmit(): void{
    if(typeof(this.editForm.value.role) === 'string' && typeof(this.editForm.value.enabled) === 'boolean' && typeof(this.editForm.value.locked) === 'boolean'){
      this.user.role = this.editForm.value.role;
      this.user.enabled = this.editForm.value.enabled;
      this.user.locked = this.editForm.value.locked;

      this.userService.update(this.storageService.getUser().auth, this.user)
          .subscribe({
            next: (resp) => {
                    this.title = "Succes Edit Data";
                    this.body = ""
                    this.user_modal = resp;
                    this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' });
                    this.router.navigate(['user-management']);
                  },
            error: (err) => {
                    this.title = "Failed Edit Data";
                    this.body = err.message;
                    this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' });
            }
          })
    }
  }

}
