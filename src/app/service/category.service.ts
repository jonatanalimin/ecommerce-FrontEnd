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
 
  addCategory(name:string): Observable<Product>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      observable: "response"
    }
    return this.http.post<Product>(`${this.categoryUrl}/add`, {'name': name}, httpOptions)
  }
  
  editCategory(id: number, name:string): Observable<Product>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      observable: "response"
    }
    return this.http.put<Product>(`${this.categoryUrl}/update/${id}`, {'name': name}, httpOptions)
  }
}
