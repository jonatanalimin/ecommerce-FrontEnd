import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string = 'http://localhost:8080/api-product';
  private categoryUrl: string = 'http://localhost:8080/api-category';
  

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({'Content-type': 'application/json'})
  }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.url}/all`);
  }

  getProductsByName(search:string): Observable<Product[]>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      observable: "response"
    }
    return this.http.get<Product[]>(`${this.url}/findByName/${search}`);
  }

  getProductsByCategory(search:string): Observable<Product[]>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      observable: "response"
    }
    return this.http.get<Product[]>(`${this.url}/findByCategory/${search}`);
  }
  
  // getCategory(): Observable<Category[]>{
  //   return this.http.get<Category[]>(`${this.categoryUrl}/all`);
  // }

  getProduct(id: number): Observable<Product>{
    // const urlByID = `http://localhost:8080/api-product/getDetail/${id}`
    return this.http.get<Product>(`${this.url}/getDetail/${id}`);
  }

  deleteProduct(auth:string, id: number | undefined){
    // const urlByID = `http://localhost:8080/api-product/delete/${id}`
    // return this.http.delete<Product>(`${this.url}/delete/${id}`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': auth}),
      observable: "response"
    }
    return this.http.delete(`${this.url}/delete/${id}`, httpOptions);
    
  }

  addProduct(auth:string, name:string, image:string, price:string, description:string, category:string): Observable<Product>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': auth
      }),
      observable: "response"
    }
    return this.http.post<Product>(`${this.url}/add`, {'name': name, 'image': image, 'price': price, 'description': description, 'category': category}, httpOptions)
  }

  editProduct(auth:string, id: number, name:string, image:string, price:string, description:string, category:string): Observable<Product>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': auth}),
      observable: "response"
    }
    return this.http.put<Product>(`${this.url}/update/${id}`, {'name': name, 'image': image, 'price': price, 'description': description, 'category': category}, httpOptions)
  }
  
  
}
