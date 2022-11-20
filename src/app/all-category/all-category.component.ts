import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../model/product';
import { CategoryService } from '../service/category.service';
import { SpinnerService } from '../service/spinner.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-all-category',
  templateUrl: './all-category.component.html',
  styleUrls: ['./all-category.component.css']
})
export class AllCategoryComponent implements OnInit {
  selectedCategory?: Category;
  title = '';
  body = '';
  @ViewChild('contentDel') mymodal: ElementRef | undefined;
  listCategory: Category[] = [];
  constructor(
    private spinnerService: SpinnerService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private categoryService: CategoryService,) { }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(): void {
    this.spinnerService.requestStarted();
    this.categoryService.getAllCategory()
    .subscribe({
      next: observable => {
        this.listCategory = observable;
        this.spinnerService.requestEnded();
      },
      error: err => {
        this.spinnerService.resetSpinner();
      }});
  }

  deleteCategory(content: any, selected : Category): void{
    this.selectedCategory = selected;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result === 'yes') {
        this.spinnerService.requestStarted();
        this.categoryService.deleteCategory(this.storageService.getUser().auth, this.selectedCategory?.id).subscribe({
          next: () => {
            this.title = 'Success Delete';
            this.body = `Success delete category: ${this.selectedCategory?.name}`;
            this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
              () => {
                this.categoryService.getAllCategory()
                  .subscribe({
                    next: observable => {
                      this.listCategory = observable;
                      this.spinnerService.requestEnded();
                    },
                    error: err => {
                      this.spinnerService.resetSpinner();
                    }});
              }, () => {
                this.categoryService.getAllCategory()
                  .subscribe({
                    next: observable => {
                      this.listCategory = observable;
                      this.spinnerService.requestEnded();
                    },
                    error: err => {
                      this.spinnerService.resetSpinner();
                    }});
              }
            );
          },
          error: (err) => {
            this.title = 'Failed Delete';
            this.body = err.message;
            this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' });
          }
        });
      }  
    }, () => {});    
  }
}