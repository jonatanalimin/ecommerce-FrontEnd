import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string = 'http://localhost:8080/api-product/all';
  

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({'Content-type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080'})
  }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(this.url);
  }
}
