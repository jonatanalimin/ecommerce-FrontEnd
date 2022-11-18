import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { observable } from 'rxjs';
import { Emitters } from '../emitter/emitter';
import { Category, Product } from '../model/product';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message= '';

  listProduct: Product[] = [];
  listCategory: Category[] = [];
  searchForm = this.fb.group({
    search: ['', Validators.required]
  });
  searchByCategoryForm = this.fb.group({
    category: ['', Validators.required]
  });
  constructor(private productService: ProductService, private categoryService: CategoryService, private http: HttpClient, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.listProduct = [];
    
    this.getProducts();
    this.getCategory();
  }

  getProducts(): void {
    this.productService.getProducts()
    .subscribe(observable => this.listProduct = observable);
  }
  
  getCategory(): void {
    this.categoryService.getAllCategory()
    .subscribe(observable => this.listCategory = observable);
  }
  
  onSearch(): void{
    if(this.searchForm.value.search){
      this.productService.getProductsByName(this.searchForm.value.search)
      .subscribe(observable => this.listProduct = observable);
    }
    else{
      this.getProducts();
    }
  }

  onSearchByCategory(): void{
    console.log("change");
    if(this.searchByCategoryForm.value.category){
      this.productService.getProductsByCategory(this.searchByCategoryForm.value.category)
      .subscribe(observable => this.listProduct = observable);
    }
    else{
      this.getProducts();
    }
  }

}
