import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product | undefined;
  constructor(private productService: ProductService, private http: HttpClient, private route: ActivatedRoute) { }

  getProduct(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(idParam)
    .subscribe(obs => {
      this.product = obs;
      console.log(this.product);
    });
  }
      
  ngOnInit(): void {      
    this.getProduct();
  }

  deleteProduct(id : number): void{
    console.log(id);
    this.productService.deleteProduct(id).subscribe();
  }

}
