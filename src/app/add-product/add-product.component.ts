import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  
  role: string = '';
  errorMessage: string ='';
  addProductForm = this.fb.group({
    name: ['', Validators.required],
    image: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
  });
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
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
    console.log("start");
    // if(typeof(this.addProductForm.value.username)==='string' && typeof(this.addProductForm.value.password)==='string'){
      // name_val = this.addProductForm.value.name;
      // image_val = this.addProductForm.value.image;
      // price_val = this.addProductForm.value.price;
      // description_val = this.addProductForm.value.description;
      // category_val = this.addProductForm.value.category;
      
      this.productService.addProduct('asd', 'asd', 10000, 'asd', 1)
      .subscribe({
        next: (response) => {
          console.log(response);
          
          console.log("start");
          window.location.reload();
        },
        error:(err) => {
          console.log("error");
          console.log(err);
          this.errorMessage = err.error.errorMessage;
          this.addProductForm.reset();
        }
      })
    // } 
  }
}
