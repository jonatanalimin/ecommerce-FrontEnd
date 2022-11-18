import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../model/product';
import { CategoryService } from '../service/category.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  category: Category | undefined;
  errorMessage: string ='';
  editCategoryForm = this.fb.group({
    name: ['', Validators.required]
  });
  constructor(
    private storageService: StorageService,
    private categoryService: CategoryService, private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) { }

  getCategory(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryService.getCategory(idParam)
    .subscribe(obs => {
      this.category = obs;
    });
  }

  ngOnInit(): void {
    this.getCategory();
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
    if(typeof(this.editCategoryForm.value.name)==='string'){
      name_val = this.editCategoryForm.value.name;
      console.log(name_val);
      this.categoryService.editCategory(this.storageService.getUser().auth, Number(this.route.snapshot.paramMap.get('id')), name_val)
      .subscribe({
        next: (response) => {
          window.location.assign("category");
        },
        error:(err) => {
          this.errorMessage = err.error.errorMessage;
          this.editCategoryForm.reset();
        }
      })
    } 
  }

}
