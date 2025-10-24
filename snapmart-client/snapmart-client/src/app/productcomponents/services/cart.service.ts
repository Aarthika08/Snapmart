
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


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

// Order interface
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  userId: string;
  date: Date;
  paymentStatus: string;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/cart'; // your working backend route
 private cartItems = new BehaviorSubject<any[]>(this.getCartFromStorage());
  cartItems$ = this.cartItems.asObservable();
  private orders: Order[] = [];

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


    

  
  getTotal(): number {
    return this.cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  getItems(): CartItem[] {
    return this.cartItems.value;
  }

  // 🔹 Local storage helpers
  private getCartFromStorage(): CartItem[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  private saveCartToStorage(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private refreshCart() {
    this.fetchCart().subscribe();
  }
 // 🔹 Fetch cart from backend and update local + storage
  // fetchCart(): Observable<CartItem[]> {
  //   return this.http.get<CartItem[]>(this.apiUrl).pipe(
  //     tap(items => {
  //       this.cartItems.next(items);
  //       this.saveCartToStorage(items);
  //     })
  //   );
  // }
fetchCart(): Observable<CartItem[]> {
  return this.http.get<CartItem[]>(this.apiUrl).pipe(
    tap(items => {
      this.cartItems.next(items);
      localStorage.setItem('cart', JSON.stringify(items));
    })
  );
}


  

  // --- New: Order methods ---
  getOrders(): Order[] {
    return this.orders;
  }

  addOrder(order: Order) {
    this.orders.push(order);
  }

  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
    
  }
}
