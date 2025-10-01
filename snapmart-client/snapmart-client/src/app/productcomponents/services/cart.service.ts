// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Product } from './product.service';

// export interface CartItem {
//   product: Product;
//   quantity: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private cart: CartItem[] = [];
//   private cartSubject = new BehaviorSubject<CartItem[]>([]);

//   cart$ = this.cartSubject.asObservable();

//   addToCart(product: Product): string {
//     if (product.stock <= 0) {
//       return 'Out of stock!';
//     }

//     const item = this.cart.find(i => i.product._id === product._id);

//     if (item) {
//       if (item.quantity < product.stock) {
//         item.quantity++;
//       } else {
//         return 'No more stock available!';
//       }
//     } else {
//       this.cart.push({ product, quantity: 1 });
//     }

//     this.cartSubject.next(this.cart);
//     return 'Added to cart!';
//   }

//   removeFromCart(productId: string) {
//     this.cart = this.cart.filter(i => i.product._id !== productId);
//     this.cartSubject.next(this.cart);
//   }

//   getCartItems(): CartItem[] {
//     return this.cart;
//   }

//   clearCart() {
//     this.cart = [];
//     this.cartSubject.next(this.cart);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Cart item interface (matches backend response)
export interface CartItem {
  productId: string;
  name?: string;           // if backend returns product name
  price: number;          // if backend returns product price
  qty: number;
  remainingStock: number;
  unit: string;

  quantity:number;
  imageUrl?: string;
  seller?: string;
  available?: boolean;
  
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/cart'; // your working backend route

  constructor(private http: HttpClient) {}

  // Get all cart items
  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  // Add product to cart (default qty = 1)
  addToCart(productId: string, qty: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, { productId, qty });
  }

  // Update quantity of a product in cart
  updateCartItem(productId: string, qty: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${productId}`, { qty });
  }

  // Remove product from cart
  removeCartItem(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}
