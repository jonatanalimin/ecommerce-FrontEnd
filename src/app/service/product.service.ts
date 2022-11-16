import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string = 'http://localhost:8080/api-product';
  

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({'Content-type': 'application/json'})
  }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.url}/all`);
  }

  getProduct(id: number): Observable<Product>{
    // const urlByID = `http://localhost:8080/api-product/getDetail/${id}`
    return this.http.get<Product>(`${this.url}/getDetail/${id}`);
  }

  deleteProduct(id: number){
    // const urlByID = `http://localhost:8080/api-product/delete/${id}`
    // return this.http.delete<Product>(`${this.url}/delete/${id}`);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observable: "response"
    }
    return this.http.delete(`${this.url}/delete/${id}`, httpOptions);
    
  }

  addProduct(name:string, image:string, price:number, description:string, category:number): Observable<Product>{
    // const httpOptions = {
    //   headers: new HttpHeaders({'Content-type': 'application/json'}),
    //   observable: "response"
    // }
    return this.http.post<Product>(`${this.url}/add`, {'"name"': name, '"image"': image, '"price"': price, '"description"': description, '"category"': category})
  }
  
}
