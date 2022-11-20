import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../model/product';
import { CategoryService } from '../service/category.service';
import { SpinnerService } from '../service/spinner.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  processing = false;
  title: string ='';
  body: string ='';
  @ViewChild('content') info : ElementRef|undefined;
  category: Category | undefined;
  errorMessage: string ='';
  editCategoryForm = this.fb.group({
    name: ['', Validators.required]
  });
  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private categoryService: CategoryService, private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) { }

  getCategory(): void {
    this.spinnerService.requestStarted();
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryService.getCategory(idParam)
    .subscribe({
      next: obs => {
      this.category = obs;
      this.editCategoryForm.setValue({name: obs.name});
      this.spinnerService.requestEnded();
      },
      error: () => {
        this.spinnerService.resetSpinner();
      }
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
    if(typeof(this.editCategoryForm.value.name)==='string'){
      this.processing = true;
      this.editCategoryForm.disable();
      name_val = this.editCategoryForm.value.name;
      console.log(name_val);
      this.categoryService.editCategory(this.storageService.getUser().auth, Number(this.route.snapshot.paramMap.get('id')), name_val)
      .subscribe({
        next: () => {
          this.processing = false;
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
          this.processing = false;
          this.editCategoryForm.enable();
          this.modalService.open(this.info, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            () => {}, () => {}
          );
        }
      })
    } 
  }

}
