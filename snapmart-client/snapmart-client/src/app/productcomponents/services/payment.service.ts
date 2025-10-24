import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable, from } from 'rxjs';

export interface CartItem {
  productId: string;
  name?: string;
  qty: number;
  price?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private api = environment.apiUrl + '/api/payment';
  private razorKey = environment.razorpayKeyId;

  constructor(private http: HttpClient) {}

  // Create order on backend (which creates Razorpay order and saves local order)
  createOrder(userId: string, cartItems: CartItem[]) {
    return this.http.post<{razorpayOrder: any, order: any}>(`${this.api}/create-order`, {
      userId, cartItems
    });
  }

  // After payment success, call backend to verify (and mark order paid)
  verifyPayment(razorpayPaymentId: string, razorpayOrderId: string) {
    return this.http.post(`${this.api}/verify-payment`, {
      razorpayPaymentId, razorpayOrderId
    });
  }

  // Utility: opens Razorpay checkout with given order info, returns a promise which resolves on success or rejects on fail
  openRazorpayCheckout(razorpayOrder: any, prefill?: { name?: string; email?: string; contact?: string; }) {
    return new Promise<{ razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature?: string }>((resolve, reject) => {
      if (!(<any>window).Razorpay) {
        return reject(new Error('Razorpay SDK not loaded'));
      }

      const options = {
        key: this.razorKey,
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency,
        name: 'Snapmart',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        prefill: prefill || {},
        handler: function (response: any) {
          // response: {razorpay_payment_id, razorpay_order_id, razorpay_signature}
          resolve(response);
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment popup closed by user'));
          }
        },
        theme: { color: '#2b6ef6' }
      };

      const rzp = new (<any>window).Razorpay(options);
      rzp.open();
    });
  }
}
