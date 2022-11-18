import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';
import { StorageService } from '../service/storage.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  modalDelete : any;
  isAdmin = false;
  @ViewChild('contentDel') mymodal: ElementRef | undefined;
  product: Product | undefined;
  closeResult: string = "";
  title:string ="";
  body:string ="";
  constructor(
    private modalService: NgbModal,
    private storageService: StorageService,
    private productService: ProductService,
    private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router) { }

  getProduct(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(idParam)
    .subscribe(obs => {
      this.product = obs;
      console.log(this.product);
    });
  }
      
  ngOnInit(): void {  
    if(this.storageService.getUser().role === "ROLE_ADMIN"){
      this.isAdmin = true;
    }   
    this.getProduct();
  }

  showDelete(content:any){
    this.modalDelete = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {
        this.deleteProduct(this.product?.id);
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });
  }

  deleteProduct(id : number | undefined): void{
    console.log(id);
    if (typeof(id) === 'number'){
      this.productService.deleteProduct(this.storageService.getUser().auth, id).subscribe({
        next: () => {
          this.title = 'Delete Success';
          this.body = this.product?.name + ' have been deleted';
          this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            () => {
              this.router.navigate(['']);
            },
            () => {
              this.router.navigate(['']);
            }
          );
        },
        error: () => {
          this.title = 'Delete Failed';
          this.body = this.product?.name + ' failed to delete';
          this.modalService.open(this.mymodal, { ariaLabelledBy: 'modal-basic-title' });
        }
      });
    }
  }

  private getDismissReason(reason: any): string {  
    if (reason === ModalDismissReasons.ESC) {  
      return 'by pressing ESC';  
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {  
      return 'by clicking on a backdrop';  
    } else {  
      return `with: ${reason}`;  
    }  
  }

}
