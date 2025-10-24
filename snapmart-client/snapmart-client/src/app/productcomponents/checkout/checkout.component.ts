import { Component, OnInit } from '@angular/core';
// import { PaymentService, CartItem } from '../services/payment.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
// import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
// import { Order } from '../services/cart.service';
import { CartService, CartItem, Order } from '../services/cart.service';
import { PaymentService } from '../services/payment.service';


@Component({
  selector: 'app-checkout',
  imports:[FormsModule,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: CartItem[] = []; // ✅ Will hold actual cart items
  userId = 'U123';
  loading = false;
  error: string | null = null;
  totalAmount: number = 0;
  

  // prefill info (optional)
  name = '';
  email = '';
  phone = '';
  // cartItems: import("d:/snapmart/snapmart-client/snapmart-client/src/app/productcomponents/services/cart.service").CartItem[];

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private cartService: CartService,
    private http: HttpClient
  ) {}

// ngOnInit(): void {
//   this.cartService.fetchCart().subscribe({
//     next: (items) => {
//       this.cart = items;
//       this.totalAmount = this.cartService.getTotal();
//       console.log("✅ Loaded cart:", this.cart);
//       console.log("✅ Total amount:", this.totalAmount);
//     },
//     error: (err) => {
//       console.error("❌ Error loading cart", err);
//     }
//   });
// }


ngOnInit(): void {
  // Subscribe to cart changes
  this.cartService.cartItems$.subscribe(items => {
    this.cart = items;
    this.totalAmount = this.cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
  });

  // Fetch cart from backend **only once at page load**
  lastValueFrom(this.cartService.fetchCart()).catch(err => console.error('❌ Error loading cart', err));
}

  
  // async payNow() {
  //   try {
  //     if (this.cart.length === 0) {
  //       this.error = 'Cart is empty';
  //       return;
  //     }
  //     this.loading = true;
  //     this.error = null;

  //     // 1) Create order on backend (which creates Razorpay order)
  //     const res: any = await this.paymentService.createOrder(this.userId, this.cart).toPromise();
  //     const razorpayOrder = res.razorpayOrder;
  //     const savedOrder = res.order;

  //     // 2) Open Razorpay checkout
  //     const prefill = { name: this.name, email: this.email, contact: this.phone };
  //     const paymentResp: any = await this.paymentService.openRazorpayCheckout(razorpayOrder, prefill);

  //     // 3) Verify payment on backend (you can pass signature for extra security)
  //     await this.paymentService.verifyPayment(paymentResp.razorpay_payment_id, paymentResp.razorpay_order_id).toPromise();

  //     // 4) Navigate to success page with local order id (or razorpayOrder id)
  //     // this.router.navigate(['/order-success', savedOrder._id]);
  //     this.router.navigate([`/order-success/${savedOrder._id}`]);
  //     alert('payment successful!');
      
    
  //   } catch (err: any) {
  //     console.error('Payment error', err);
  //     this.error = err.message || 'Payment failed';
  //     // you may retry or show meaningful UI
  //   } finally {
  //     this.loading = false;
  //   }
  // }


async payNow() {
  if (this.cart.length === 0) {
    this.error = 'Cart is empty';
    return;
  }

  this.loading = true;
  this.error = null;

  try {
    // 1) Create order on backend
    const res: any = await lastValueFrom(this.paymentService.createOrder(this.userId, this.cart));
    const razorpayOrder = res.razorpayOrder;
    const savedOrder = res.order;
     const backendOrder = res.order; 

    // 2) Open Razorpay checkout safely
    const prefill = { name: this.name, email: this.email, contact: this.phone };

    try {
      const paymentResp: any = await this.paymentService.openRazorpayCheckout(razorpayOrder, prefill);
      
      // 3) Verify payment on backend
      await lastValueFrom(
        this.paymentService.verifyPayment(paymentResp.razorpay_payment_id, paymentResp.razorpay_order_id)
      );

      // 4) Navigate to success page
  const order: Order = {
        id: backendOrder._id, // use backend order id
        items: [...this.cart], // copy of current cart
        total: this.totalAmount,
        userId: this.userId,
        date: new Date(),
        paymentStatus: 'success'
      };

 this.cartService.addOrder(order);  // save order
    this.cartService.clearCart();       // clear cart (BehaviorSubject + local storage)

    // Update local variables so UI updates immediately
    this.cart = [];
    this.totalAmount = 0;

    // 5) Navigate to order success page
    this.router.navigate([`/order-success/${order.id}`]);

    console.log('All Orders:', this.cartService.getOrders());
    alert('Payment successful!');
    } catch (razorErr: any) {
      // Handles Razorpay errors and unsafe header warnings
      console.error('Razorpay error', razorErr);
      this.error = 'Payment failed. Please try again.';
    }

  } catch (err: any) {
    console.error('Order creation or verification error', err);
    this.error = 'Payment failed. Please try again.';
  } finally {
    this.loading = false;
  }
}






  
  


}
