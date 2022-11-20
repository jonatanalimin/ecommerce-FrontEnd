import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product } from '../model/product';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';
import { SpinnerService } from '../service/spinner.service';
import { StorageService } from '../service/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  title = '';
  body = '';
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
    name: ['', Validators.required],
    image: [''],
    price: [-1, Validators.required],
    description: ['', Validators.required],
    category: [-1, Validators.required],
  });

  @ViewChild('contentInfo') myModal : ElementRef | undefined;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private spinnerService: SpinnerService,
    private storageService: StorageService,
    private productService: ProductService, private categoryService: CategoryService, private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) { }
  
  getProduct(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(idParam)
      .subscribe({
        next: (obs) => {
          this.product = obs;
          this.selectedQuantity = obs.categoryModel.id;
          this.editProductForm.setValue({
            name: this.product.name, 
            image: '', 
            price: Number(this.product.price),
            description: this.product.description,
            category: this.product.categoryModel.id
          })
          this.tmpName = this.product.name;
          this.tmpImg = this.product.image;
          this.tmpPrice = this.product.price;
          this.tmpDescription = this.product.description;
          this.tmpCategory = this.product.categoryModel;
          this.getCategory();
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
      
  ngOnInit(): void { 
    this.spinnerService.requestStarted();     
    this.getProduct();
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
    this.spinnerService.requestStarted();
    this.errorMessage = '';
    let name_val: string;
    let image_val: string;
    let price_val: number;
    let description_val: string;
    let category_val: number;
    console.log(typeof(this.editProductForm.value.price));
    if(typeof(this.editProductForm.value.name)==='string'
      && typeof(this.editProductForm.value.price)==='number'
      && typeof(this.editProductForm.value.description)==='string'
      && typeof(this.editProductForm.value.category)==='number'){
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

      this.productService.editProduct(this.storageService.getUser().auth, Number(this.route.snapshot.paramMap.get('id')), name_val, image_val, price_val.toString(), description_val, category_val)
      .subscribe({
        next: (response) => {
          this.title = "Success Edit";
          this.body = `Success edit data for ${name_val} product!`;
          this.modalService.open(this.myModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            () => {
              this.spinnerService.requestEnded();
              this.router.navigate([`product-details/${Number(this.route.snapshot.paramMap.get('id'))}`]);
            },
            () => {
              this.spinnerService.requestEnded();
              this.router.navigate([`product-details/${Number(this.route.snapshot.paramMap.get('id'))}`]);
            }
          );
        },
        error:(err) => {
          this.title = "Failed Edit";
          this.body = err.message;
          this.modalService.open(this.myModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            () => {
              this.spinnerService.resetSpinner();
            },
            () => {
              this.spinnerService.resetSpinner();
            }
          );
        }
      })
    } else{
      this.spinnerService.resetSpinner();
    }
  }
}
