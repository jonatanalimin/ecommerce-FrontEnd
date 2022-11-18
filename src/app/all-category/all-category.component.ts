import { Component, OnInit } from '@angular/core';
import { Category } from '../model/product';
import { CategoryService } from '../service/category.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-all-category',
  templateUrl: './all-category.component.html',
  styleUrls: ['./all-category.component.css']
})
export class AllCategoryComponent implements OnInit {

  listCategory: Category[] = [];
  constructor(
    private storageService: StorageService,
    private categoryService: CategoryService,) { }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(): void {
    this.categoryService.getAllCategory()
    .subscribe(observable => this.listCategory = observable);
  }

  deleteCategory(id : number | undefined): void{
    console.log(id);
    this.categoryService.deleteCategory(this.storageService.getUser().auth, id).subscribe();
    
    window.location.assign("");
  }
}