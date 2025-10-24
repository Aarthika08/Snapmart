import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
    imports:[DatePipe,CommonModule],
  selector: 'app-order-success',
  templateUrl: './order-success.component.html'
})
export class OrderSuccessComponent implements OnInit {
  order: any = null;
  loading = true;
  constructor(private route: ActivatedRoute, private http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    // If your endpoint supports fetch by order _id:
    if (orderId) {
      this.http.get<any>(`${environment.apiUrl}/api/payment/orders/${orderId}`).subscribe({
        next: (res) => { this.order = res; this.loading = false; },
        error: () => { this.loading = false; }
      });
    } else {
      this.loading = false;
    }
  }

  goOrders() {
    this.router.navigate(['/product']);
    
  }
}
