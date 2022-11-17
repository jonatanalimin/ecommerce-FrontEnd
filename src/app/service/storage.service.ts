import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  clean(): void {
    window.localStorage.clear();
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isAdmin(): boolean {
    const user = this.getUser();
    if (user) {
      if(user.role === 'ROLE_ADMIN'){
        return true
      }
    }
    return false;
  }

  public isUserAdmin(): boolean {
    const user = this.getUser();
    if (user) {
      if(user.role === 'ROLE_ADMIN' || user.role === 'ROLE_USER'){
        return true
      }
    }
    return false;
  }

  public isLoggedIn(): boolean {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
