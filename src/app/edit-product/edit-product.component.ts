import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category, Product } from '../model/product';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product: Product | undefined;
  listCategory: Category[] = [];
  errorMessage: string ='';
  tmpName: string ='';
  tmpImg: string ='';
  tmpPrice: string ='';
  tmpDescription: string ='';
  tmpCategory: Category = {
    'id': 0,
    'name': ''
  };
  selectedQuantity: number | undefined;
  myReader:FileReader = new FileReader();
  editProductForm = this.fb.group({
    name: [''],
    image: [''],
    price: [''],
    description: [''],
    category: [''],
  });
  constructor(
    private storageService: StorageService,
    private productService: ProductService, private categoryService: CategoryService, private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) { }
  
  getProduct(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(idParam)
    .subscribe(obs => {
      this.product = obs;
      console.log(this.product);
      this.selectedQuantity = obs.categoryModel.id;
      console.log(this.selectedQuantity);
      this.tmpName = this.product.name;
      this.tmpImg = this.product.image;
      this.tmpPrice = this.product.price;
      this.tmpDescription = this.product.description;
      this.tmpCategory = this.product.categoryModel;
    });
  }
  
  getCategory(): void {
    this.categoryService.getAllCategory()
    .subscribe(observable => this.listCategory = observable);
  }
      
  ngOnInit(): void {      
    this.getProduct();
    this.getCategory();
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

  onSubmit(): void{
    this.submit();
  }

  submit(): void{
    this.errorMessage = '';
    let name_val: string;
    let image_val: string;
    let price_val: string;
    let description_val: string;
    let category_val: string;
    console.log(this.editProductForm);
    if(typeof(this.editProductForm.value.name)==='string'
      && typeof(this.editProductForm.value.price)==='string'
      && typeof(this.editProductForm.value.description)==='string'
      && typeof(this.editProductForm.value.category)==='string'){
      name_val = this.editProductForm.value.name;
      price_val = this.editProductForm.value.price;
      description_val = this.editProductForm.value.description;
      category_val = this.editProductForm.value.category;
      
      if(this.myReader.result?.toString()){
        image_val = this.myReader.result?.toString();
      }
      else{
        image_val = this.tmpImg;
      }

      if(!name_val){
        name_val = this.tmpName;
      }
      if(!price_val){
        price_val = this.tmpPrice;
      }
      if(!description_val){
        description_val = this.tmpDescription;
      }
      if(!category_val){
        category_val = this.tmpCategory.id.toString();
      }

      this.productService.editProduct(this.storageService.getUser().auth, Number(this.route.snapshot.paramMap.get('id')), name_val, image_val, price_val, description_val, Number(category_val))
      .subscribe({
        next: (response) => {
          window.location.assign("");
        },
        error:(err) => {
          this.errorMessage = err.error.errorMessage;
          this.editProductForm.reset();
        }
      })
    } 
  }
}
