import { Component, OnInit } from '@angular/core';
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

  constructor(
    private userService: UserService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.userService.getAll(this.storageService.getUser().auth)
      .subscribe({
        next: (resp) => {
          console.log(resp)
        },
        error:(err) => (console.error(err))
      })
  }

}
