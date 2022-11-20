import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../service/category.service';
import { SpinnerService } from '../service/spinner.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  processing = false;
  title: string ='';
  body: string ='';
  @ViewChild('content') info : ElementRef | undefined;
  addCategoryForm = this.fb.group({
    name: ['', Validators.required]
  });
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private spinnerService: SpinnerService,
    private storageService: StorageService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.processing = false;
    this.addCategoryForm.enable();
  }
  
  onSubmit(): void{
    this.submit();
  }

  submit(): void{
    let name_val: string;
    if(typeof(this.addCategoryForm.value.name)==='string'){
      this.processing=true;
      this.addCategoryForm.disable();
      name_val = this.addCategoryForm.value.name;

      this.categoryService.addCategory(this.storageService.getUser().auth, name_val)
      .subscribe({
        next: () => {
          this.title = 'Success Add Category';
          this.body = `Success add category: ${name_val}`;
          this.modalService.open(this.info, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            () => {
              this.router.navigate(["category"]);
            },
            () => {
              this.router.navigate(["category"]);
            }
          );
        },
        error:(err) => {
          this.title = 'Failed Add Category';
          this.body = err.message;
          this.addCategoryForm.reset();
              this.processing = false;
              this.addCategoryForm.enable();
          this.modalService.open(this.info, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            () => {}, () => {}
          );
        }
      })
    } 
  }
}
