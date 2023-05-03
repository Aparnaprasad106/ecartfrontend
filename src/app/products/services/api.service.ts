import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // searchterm
  searchTerm = new BehaviorSubject('')
  // to hold cart count
  cartItemsCount = new BehaviorSubject(0)
BASE_URL= 'https://ecartservice.onrender.com'
  constructor(private http:HttpClient) { 
    this.cartCount()
  }
  // get all products
  getallproducts(){
    // api
    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }

  // viewproduct
  viewproduct(id:any){
    // api
    return this.http.get(`${this.BASE_URL}/products/view-product/${id}`)
  }

  // wishlist/add-product
  addtowishlist(id:any,title:any,price:any,image:any){
    const body ={
      id,title,price,image
    }
    // api 
    return this.http.post(`${this.BASE_URL}/wishlist/add-product`,body)
  }

  // Wishlist-getitems
  getwishlist(){
    // api
    return this.http.get(`${this.BASE_URL}/wishlist/get-items`)

  }
  // wishlist/remove-item/id
  removewishlistitem(id:any){
    return this.http.delete(`${this.BASE_URL}/wishlist/remove-item/${id}`)

  }
  // add to cart
  // localhost:3000/cart/add-product
  addtocart(product:any){
    // get id,title,image,price,quantity from product
    const body = {
      id:product.id,
      title:product.title,
      image:product.image,
      price:product.price,
      quantity:product.quantity
    }
    return this.http.post(`${this.BASE_URL}/cart/add-product`,body)

  }
  // cart/all-products
  getCart(){
    return this.http.get(`${this.BASE_URL}/cart/all-products`)

  }
  // cartCount
  cartCount(){
    this.getCart().subscribe((result:any)=>{
      this.cartItemsCount.next(result.length)
    })
  }
  // wishlist/remove-item/id
  removecartlistitem(id:any){
    return this.http.delete(`${this.BASE_URL}/cart/remove-item/${id}`)
  }
  // /cart/remove-all-items
  emptycart(){
    return this.http.delete(`${this.BASE_URL}/cart/remove-all-items`)
  }

  // increment quantity-cart/increment-item/1
  incrementquantity(id:any){
    return this.http.get(`${this.BASE_URL}/cart/increment-item/${id}`)

  }

// /cart/decrement-item/1
decrementquantity(id:any){
  return this.http.get(`${this.BASE_URL}/cart/decrement-item/${id}`)

}
}