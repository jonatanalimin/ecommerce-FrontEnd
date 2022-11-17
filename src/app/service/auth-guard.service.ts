import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {  
  constructor(private _router: Router, private storageService:StorageService) { }  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {  
      if (this.storageService.isAdmin()) {  
          return true;  
      }  
      this._router.navigate(['']);  
      return false;  
  }  
}
