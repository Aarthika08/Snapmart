import { Component ,OnInit} from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { HttpClientModule ,HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';   
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-product-list',
    standalone:true,
    providers: [ProductService],
  imports: [MatInputModule,CommonModule,HttpClientModule,MatCardModule,MatButtonModule,MatToolbarModule,FormsModule,MatFormFieldModule ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductList  implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';


  constructor(private productService: ProductService,private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error fetching products', err)
    });
  }

  addToCart(product: Product) {
    const message = this.cartService.addToCart(product);
    alert(message);
  }

filterCategory(category: string) {
  if (category === 'All') {
    this.filteredProducts = this.products;
  } else {
    this.filteredProducts = this.products.filter(p => p.category === category);
  }
}


}
