import { Component,OnInit } from '@angular/core';
import { CartService,CartItem } from '../services/cart.service';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule ,HttpClient} from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-cart',
    standalone: true,

    imports: [FormsModule,CommonModule,HttpClientModule,MatButtonModule,MatCardModule,MatToolbarModule,MatIconModule] , // import FormsModule here!
  
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
 cartItems: CartItem[] = [];
  loading = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Load all cart items
  loadCart() {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.loading = false;
      }
    });
  }

  // Increase quantity (max = remaining stock)
  increaseQty(item: CartItem) {
    if (item.qty < item.remainingStock) {
      const newQty = item.qty + 1;
      this.cartService.updateCartItem(item.productId, newQty).subscribe(() => {
        item.qty = newQty;
      });
    }
  }

  // Decrease quantity (min = 1)
  decreaseQty(item: CartItem) {
    if (item.qty > 1) {
      const newQty = item.qty - 1;
      this.cartService.updateCartItem(item.productId, newQty).subscribe(() => {
        item.qty = newQty;
      });
    }
  }

  // Remove item from cart
  removeItem(item: CartItem) {
    this.cartService.removeCartItem(item.productId).subscribe(() => {
      this.loadCart();
    });
  }

  // Total items in cart
  totalItems() {
    return this.cartItems.reduce((acc, i) => acc + i.qty, 0);
  }

  // Total price of all items
totalPrice(): number {
  return this.cartItems.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);
}





  updateQuantityFromInput(event: any, item: CartItem) {
    let newQty = parseInt(event.target.value, 10);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    item.quantity = newQty;
  }


  moveToWishlist(item: CartItem) {
    alert(`${item.name} moved to wishlist (dummy action)`);
  }

  applyPromo(code: string) {
    alert(`Promo applied: ${code} (dummy action)`);
  }

  checkout() {
    alert('Proceeding to checkout...');
  }

}