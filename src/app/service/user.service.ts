import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResp } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }

  login(username:string, password:string): Observable<LoginResp>{
    console.log(username);
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      params: {'username': username, 'password': password},
      observable: "response"
    }
    return this.http.post<LoginResp>(`${this.baseUrl}/login`, null ,httpOptions)
  }
}
