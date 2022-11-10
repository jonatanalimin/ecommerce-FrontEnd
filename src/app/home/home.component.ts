import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { observable } from 'rxjs';
import { Emitters } from '../emitter/emitter';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message= '';

  listProduct: Product[] = [];
  id = 5;
  constructor(private productService: ProductService, private http: HttpClient) { }

  ngOnInit(): void {
    this.listProduct = [];
    
    this.getProducts();
  }

  getProducts(): void {
    // this.listHero = this.heroService.getHeroes();
    console.log("asd");
    this.productService.getProducts()
    .subscribe(observable => this.listProduct = observable);
  }

}
