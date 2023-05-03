import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  public payPalConfig?: IPayPalConfig;

  allproducts:any=[]
  cartTotalPrice:number=0
  proceedtopaymentbtnstatus:boolean=false
  offerclickstatus:boolean=false
  discountclickedStatus:boolean = false
  showsuccess:boolean=false
  showCancel:boolean=false
  showError:boolean=false
  showpaypal:boolean=false
  username:string=""
  flat:string=""
  street:string=""
  state:string=""

  // address
  addressForm = this.fb.group({
    username:[''],
    flat:[''],
    street:[''],
    state:['']
  })

constructor(private api:ApiService,private fb:FormBuilder){}
ngOnInit(): void {
  this.api.getCart()
  .subscribe((result:any)=>{
    // 200
    console.log(result);
    this.allproducts=result
    // getCartTotal
    this.getCartTotal()
     // paypal
  this.initConfig()
  },
  (result:any)=>{
    // 400
    console.log(result.error);
    
  }
  )
 
}

// get cart total
getCartTotal(){
  let total=0
  this.allproducts.forEach((item:any)=>{
    total += item.grantTotal
    this.cartTotalPrice = Math.ceil(total)
  })
}


 // removeitem
 removeItem(id:any){
  this.api.removecartlistitem(id)
  .subscribe((result:any)=>{
    this.allproducts=result
    this.getCartTotal()
    this.api.getCart()
  },
  (result:any)=>{
    alert(result.error)
  }
  )
}

// empty cart
emptycart(){
  this.api.emptycart()
  .subscribe((result:any)=>{
    // 200
    this.allproducts=[]
    this.getCartTotal()
    this.api.cartCount()

  },
  (result:any)=>{
    alert(result.error)
  })
}

// increment cart
incrementCart(id:any){
  this.api.incrementquantity(id)
  .subscribe((result:any)=>{
    // 200
    this.allproducts=result
    // update total
    this.getCartTotal()
  },
  (result:any)=>{
    alert(result.error)
  }
  )
}
// decrement quantity
decrementCart(id:any){
  this.api.decrementquantity(id)
  .subscribe((result:any)=>{
    // 200
    this.allproducts =  result
     // update total
     this.getCartTotal()
  },
  (result:any)=>{
    alert(result.error)
  }
  )
}
// proceed to payment
SubmitBtn(){
  if(this.addressForm.valid){
    this.proceedtopaymentbtnstatus=true
    this.username=this.addressForm.value.username||""
    this.flat=this.addressForm.value.flat||""
    this.street=this.addressForm.value.street||""
    this.state=this.addressForm.value.state||""


  }
  else{
    alert('please enter valid inputs')
  }
}

// offerclicked
offerClicked(){
  this.offerclickstatus=true
}

// discount50()
discount50(){
  let discount = Math.ceil(this.cartTotalPrice*50/100)
  this.cartTotalPrice-=discount
  this.discountclickedStatus = true

}

// discount50()
discount10(){
  let discount = Math.ceil(this.cartTotalPrice*10/100)
  this.cartTotalPrice-=discount
  this.discountclickedStatus = true

}

// paypal payment
private initConfig(): void {
  let amount = this.cartTotalPrice.toString()
  this.payPalConfig = {
  currency: 'USD',
  clientId: 'sb',
  createOrderOnClient: (data) => <ICreateOrderRequest>{
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount,
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: amount
            }
          }
        },
        items: [
          {
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: amount,
            },
          }
        ]
      }
    ]
  },
  advanced: {
    commit: 'true'
  },
  style: {
    label: 'paypal',
    layout: 'vertical'
  },
  onApprove: (data, actions) => {
    console.log('onApprove - transaction was approved, but not authorized', data, actions);
    actions.order.get().then((details:any) => {
      console.log('onApprove - you can get full order details inside onApprove: ', details);
    });
  },
  onClientAuthorization: (data) => {
    console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    this.showsuccess = true;
    // empty cart
    this.emptycart()
    // hide paypal div
    this.showpaypal=false
    // hide proceed to payment
    this.proceedtopaymentbtnstatus=false
  },
  onCancel: (data, actions) => {
    console.log('OnCancel', data, actions);
    this.showCancel=true
  },
  onError: err => {
    console.log('OnError', err);
    this.showError=true
    // hide paypal div
    this.showpaypal=true
  },
  onClick: (data, actions) => {
    console.log('onClick', data, actions);

  },
};
}
// makepayment
makepayment(){
this.showpaypal=true
}

// modelClose
modelClose(){
  this.addressForm.reset()
  this.showCancel=false
  this.showError=false
  this.showsuccess=false
  this.proceedtopaymentbtnstatus=false
  this.showpaypal=false
}


}
