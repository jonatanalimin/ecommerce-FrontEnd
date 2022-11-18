import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  errorMessage: string ='';
  addCategoryForm = this.fb.group({
    name: ['', Validators.required]
  });
  constructor(
    private categoryService: CategoryService,
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
    if(typeof(this.addCategoryForm.value.name)==='string'){
      name_val = this.addCategoryForm.value.name;

      this.categoryService.addCategory(name_val)
      .subscribe({
        next: (response) => {
          window.location.assign("category");
        },
        error:(err) => {
          this.errorMessage = err.error.errorMessage;
          this.addCategoryForm.reset();
        }
      })
    } 
  }
}
