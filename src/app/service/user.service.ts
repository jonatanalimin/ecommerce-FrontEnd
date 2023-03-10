import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResp, UserManagementGetAllResp } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }

  login(username:string, password:string): Observable<LoginResp>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      observable: "response"
    }
    return this.http.post<LoginResp>(`${this.baseUrl}/login`, {'username': username, 'password': password}, httpOptions)
  }

  register(username:string, password:string): Observable<LoginResp>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      observable: "response"
    }
    return this.http.post<LoginResp>(`${this.baseUrl}/users`, {'username': username, 'password': password}, httpOptions)
  }

  getAll(auth: string): Observable<UserManagementGetAllResp[]>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': auth
      })
    }
    return this.http.get<UserManagementGetAllResp[]>(`${this.baseUrl}/users`, httpOptions)
  }

  getById(auth: string, id:number): Observable<UserManagementGetAllResp>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': auth
      })
    }
    return this.http.get<UserManagementGetAllResp>(`${this.baseUrl}/users/${id}`, httpOptions)
  }

  update(auth:string, user: UserManagementGetAllResp): Observable<UserManagementGetAllResp>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': auth,
      })
    }
    return this.http.put<UserManagementGetAllResp>(`${this.baseUrl}/users`, user, httpOptions)
  }

  chgExpiryPass(id:number, newPassword:string, oldPassword:string): Observable<string>{
    let params_ = new HttpParams({
      fromObject: {
        id: id,
        oldPassword: oldPassword,
        newPassword: newPassword
      }
    });
    return this.http.put<string>(`${this.baseUrl}/users/changeExpPassword`, null, {params: params_})
  }

  chgPass(id:number, newPassword:string, oldPassword:string): Observable<LoginResp>{
    let params_ = new HttpParams({
      fromObject: {
        id: id,
        oldPassword: oldPassword,
        newPassword: newPassword
      }
    });
    return this.http.put<LoginResp>(`${this.baseUrl}/users/changePassword`, null, {params: params_})
  }

  delete(auth: string, id:number): Observable<void>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': auth,
      })
    }
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`, httpOptions)
  }
}
