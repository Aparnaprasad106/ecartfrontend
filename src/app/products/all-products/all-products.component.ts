import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{
  searchTerm:string=''
  allproducts:any=[]
  constructor(private api:ApiService){

  }
ngOnInit(): void {
  this.api.getallproducts()
  .subscribe((result:any)=>{
    console.log(result);
    this.allproducts=result
  })
  // to get searchterm from apiservice
  this.api.searchTerm.subscribe((result:any)=>{
    this.searchTerm=result
    console.log(this.searchTerm);
    
  })
}

// add to cart
addtocart(product:any){
  // add {quantity:1} to product object
  Object.assign(product,{quantity:1})
  console.log(product);
  
  // api
  this.api.addtocart(product)
  .subscribe((result:any)=>{
    // 200
    // call cartcount
    this.api.cartCount()
    alert(result)
  },
  // 400
  (result:any)=>{
    alert(result.error)
  }
  )
}
}
