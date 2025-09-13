import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  addToCart(product: Product): string {
    if (product.stock <= 0) {
      return 'Out of stock!';
    }

    const item = this.cart.find(i => i.product._id === product._id);

    if (item) {
      if (item.quantity < product.stock) {
        item.quantity++;
      } else {
        return 'No more stock available!';
      }
    } else {
      this.cart.push({ product, quantity: 1 });
    }

    this.cartSubject.next(this.cart);
    return 'Added to cart!';
  }

  removeFromCart(productId: string) {
    this.cart = this.cart.filter(i => i.product._id !== productId);
    this.cartSubject.next(this.cart);
  }

  getCartItems(): CartItem[] {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.cartSubject.next(this.cart);
  }
}
