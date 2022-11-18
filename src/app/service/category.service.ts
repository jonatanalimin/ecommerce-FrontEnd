import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryUrl: string = 'http://localhost:8080/api-category';
  

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({'Content-type': 'application/json'})
  }

  getAllCategory(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.categoryUrl}/all`);
  }

  getCategory(id: number): Observable<Product>{
    return this.http.get<Product>(`${this.categoryUrl}/getDetail/${id}`);
  }
 
  addCategory(auth: string, name:string): Observable<Product>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': auth
      }),
      observable: "response"
    }
    return this.http.post<Product>(`${this.categoryUrl}/add`, {'name': name}, httpOptions)
  }
  
  editCategory(auth: string, id: number, name:string): Observable<Product>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': auth
      }),
      observable: "response"
    }
    return this.http.put<Product>(`${this.categoryUrl}/update/${id}`, {'id':0, 'name': name}, httpOptions)
  }
  
  deleteCategory(auth: string, id: number | undefined){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': auth
      }),
      observable: "response"
    }
    return this.http.delete(`${this.categoryUrl}/delete/${id}`, httpOptions);
    
  }
}
