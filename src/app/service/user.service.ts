import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
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
}
