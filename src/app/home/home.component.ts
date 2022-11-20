import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { observable } from 'rxjs';
import { Emitters } from '../emitter/emitter';
import { Category, Product } from '../model/product';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';
import { SpinnerService } from '../service/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message= '';
  searchText: string = '';
  listProduct: Product[] = [];
  backupListProduct: Product[] = [];
  listCategory: Category[] = [];
  searchByCategoryForm = this.fb.group({
    category: ['', Validators.required]
  });
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.listProduct = [];
    this.spinnerService.requestStarted();
    this.getProducts();
    this.getCategory();
  }

  getProducts(): void {
    this.productService.getProducts()
    .subscribe({
      next: (observable) => {
        this.listProduct = observable;
        this.backupListProduct= observable;
        this.spinnerService.requestEnded();
      },
      error: (err) => {
        this.spinnerService.resetSpinner();
      }
    });
  }
  
  getCategory(): void {
    this.categoryService.getAllCategory()
    .subscribe(observable => this.listCategory = observable);
  }
  
  onSearch(newText: string): void{
    if(newText === ''){
      this.listProduct = this.backupListProduct;
    }else{
      this.listProduct = [];
      this.backupListProduct.forEach(element => {
        if(element.name.toLowerCase().includes(newText.toLowerCase())){
          this.listProduct.push(element);
        }
      });
    }
  }

  resetSearch():void{
    this.searchText = "";
    this.listProduct = this.backupListProduct;
  }

  onSearchByCategory(): void{
    this.searchText = "";
    if(this.searchByCategoryForm.value.category){
      this.productService.getProductsByCategory(this.searchByCategoryForm.value.category)
      .subscribe(observable => {
        this.listProduct = observable;
        this.backupListProduct = observable;
      });
    }
    else{
      this.getProducts();
    }
  }

}
