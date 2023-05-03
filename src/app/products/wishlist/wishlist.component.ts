import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent  implements OnInit{
  allProducts:any=[]
  constructor(private api:ApiService){}
  ngOnInit(): void {
    this.api.getwishlist()
    .subscribe((result:any)=>{
      console.log(result);
      this.allProducts=result

    },
    (result:any)=>{
      console.log(result.error);
    }
    )
  }

  // removeitem
  removeItem(id:any){
    this.api.removewishlistitem(id)
    .subscribe((result:any)=>{
      this.allProducts=result
    },
    (result:any)=>{
      alert(result.error)
    }
    )
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
    // remove that item from wishlist
    this.removeItem(product.id)
    alert(result)
  },
  // 400
  (result:any)=>{
    alert(result.error)
  }
  )
}
}
