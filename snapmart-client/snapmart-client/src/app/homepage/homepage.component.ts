import { Component, OnInit,OnDestroy} from '@angular/core';
import { HttpClientModule ,HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';


@Component({
  selector: 'app-homepage',
   standalone: true,
  imports: [HttpClientModule,CommonModule,FormsModule,MatInputModule,
    MatCardModule,MatButtonModule,MatToolbarModule,FormsModule,MatFormFieldModule ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})



export class HomepageComponent implements OnInit, OnDestroy {
  activeSlide = 0;
  slideInterval: any;
  cartCount = 0;


  banners = [
    { image: 'assets/banner1.jpg', title: 'Big Sale', subtitle: 'Up to 50% Off!' },
    { image: 'assets/banner2.jpg', title: 'New Arrivals', subtitle: 'Trendy Collections 2025' },
    { image: 'assets/banner3.jpg', title: 'Exclusive Deals', subtitle: 'Shop Before It Ends!' }
  ];

  // --- Categories ---
  categories = [
    { name: 'Fashion', image: 'assets/watches.jpg' },
    { name: 'Electronics', image: 'assets/watch2.jpg' },
    { name: 'Home', image: 'assets/shirts.jpg' },
    { name: 'Sports', image: 'assets/shoes.jpg' },
    { name: 'Beauty', image: 'assets/bags.jpg' }
  ];

  // --- Products ---
  products = [
    { id: 1, name: 'T-Shirt', price: 499, image: 'assets/shirts.jpg', category: 'Fashion' },
    { id: 2, name: 'Headphones', price: 1499, image: 'assets/headphones.jpg', category: 'Electronics' },
    { id: 3, name: 'Sofa', price: 8999, image: 'assets/sofa.jpg', category: 'Home' },
    { id: 4, name: 'Bags', price: 1299, image: 'assets/bag2.jpg', category: 'Sports' },
    { id: 5, name: 'Lipstick', price: 299, image: 'assets/lipstick.jpg', category: 'Beauty' }
  ];
searchInput: any;

  constructor(private router: Router) {}

  // --- Lifecycle ---
  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // --- Carousel controls ---
  nextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.banners.length;
  }

  prevSlide() {
    this.activeSlide =
      (this.activeSlide - 1 + this.banners.length) % this.banners.length;
  }

  selectSlide(index: number) {
    this.activeSlide = index;
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // auto-slide every 4s
  }

  // --- Actions ---
  addToCart(product: any) {
    this.cartCount++;
    console.log('Added to cart:', product);
  }

  viewProduct(product: any) {
    console.log('View product:', product);
    // 👉 later you can navigate to details page
    // this.router.navigate(['/product', product.id]);
  }

  filterByCategory(category: string) {
    console.log('Filter by category:', category);
    // 👉 later: fetch from API or filter this.products
  }

  onSearch(query: string) {
    if (!query) return;
    console.log('Search:', query);
    // 👉 later: implement search filter
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
