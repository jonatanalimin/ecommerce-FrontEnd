import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs';
import { Emitters } from '../emitter/emitter';
import { Nav } from '../model/nav';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  navigation_left: Nav[] = [
    {
      menu: 'Home',
      routerLink: '',
      roles: ['ALL']
    }
  ];
  navigation_left_default: Nav[] = [
    {
      menu: 'Add Product',
      routerLink: 'add-product',
      roles: ['ROLE_ADMIN']
    }, {
      menu: 'Manage Category',
      routerLink: '',
      roles: ['ROLE_ADMIN']
    }, {
      menu: 'Manage User',
      routerLink: '',
      roles: ['ROLE_ADMIN']
    }, {
      menu: 'Biodata',
      routerLink: '',
      roles: ['ROLE_USER', 'ROLE_ADMIN']
    }
  ];

  authenticated = false;
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username?: string;
  private role?: string;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
    ) { }

  ngOnInit(): void {
    // Emitters.authenticator.subscribe(
    //   (auth:boolean) => {
    //     this.authenticated = auth;
    //   }
    // )
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn){
      const user = this.storageService.getUser();
      this.username = user.username;

      this.navigation_left_default.forEach(nav => {
        if (nav.roles.includes(user.role)){
          this.navigation_left.push(nav);
        }
      });
    }
  }

  logout(): void {
    // this.http.post('', {}, {withCredentials: true})
    // .subscribe(() => this.authenticated = false);
    this.storageService.clean();
    window.location.reload();
  }
}
