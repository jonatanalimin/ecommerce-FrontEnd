import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Category } from '../model/product';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  
  role: string = '';
  image: string = '';
  
  myReader:FileReader = new FileReader();
  listCategory: Category[] = [];
  errorMessage: string ='';
  addProductForm = this.fb.group({
    name: ['', Validators.required],
    image: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
  });
  constructor(
    private storageService: StorageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.getCategory();
  }

  onSubmit(): void{
    this.submit();
  }

  getCategory(): void {
    this.categoryService.getAllCategory()
    .subscribe(observable => this.listCategory = observable);
  }

  submit(): void{
    this.errorMessage = '';
    let name_val: string;
    let image_val: string;
    let price_val: string;
    let description_val: string;
    let category_val: string;
    if(typeof(this.addProductForm.value.name)==='string'
      && this.myReader.result?.toString()
      && typeof(this.addProductForm.value.price)==='string'
      && typeof(this.addProductForm.value.description)==='string'
      && typeof(this.addProductForm.value.category)==='string'){
      name_val = this.addProductForm.value.name;
      image_val = this.myReader.result?.toString();
      price_val = this.addProductForm.value.price;
      description_val = this.addProductForm.value.description;
      category_val = this.addProductForm.value.category;
      
      this.productService.addProduct(this.storageService.getUser().auth, name_val, image_val, price_val, description_val, category_val)
      .subscribe({
        next: (response) => {
          window.location.assign("");
        },
        error:(err) => {
          this.errorMessage = err.error.errorMessage;
          this.addProductForm.reset();
        }
      })
    } 
  }

  changeListener($event: any) : void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
  
    this.myReader.onloadend = (e) => {
      this.myReader.result;
    }
    this.myReader.readAsDataURL(file);
  }
}
