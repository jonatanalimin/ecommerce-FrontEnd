import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  title='';
  body='';
  processing = false;
  @ViewChild('contentInfo') myModal : ElementRef | undefined;
  
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
    private router: Router,
    private modalService: NgbModal,
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
      
      this.processing = true;
      this.addProductForm.disable();
      name_val = this.addProductForm.value.name;
      image_val = this.myReader.result?.toString();
      price_val = this.addProductForm.value.price;
      description_val = this.addProductForm.value.description;
      category_val = this.addProductForm.value.category;
      
      this.productService.addProduct(this.storageService.getUser().auth, name_val, image_val, price_val, description_val, Number(category_val))
      .subscribe({
        next: () => {
          this.processing = false;
          this.title = 'Success Add Product';
          this.body = `Success add product: ${name_val}`;
          this.modalService.open(this.myModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            () => {
              this.router.navigate([""]);
            },
            () => {
              this.router.navigate([""]);
            }
          );
        },
        error:(err) => {
          this.title = 'Failed Add Category';
          this.body = err.message;
          this.processing = false;
          this.addProductForm.enable();
          this.modalService.open(this.myModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            () => {}, () => {}
          );
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
