import { AuthService } from '../auth.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule ,HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,  // mark component as standalone
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule,CommonModule,HttpClientModule]  // import FormsModule here!
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  // router: any;

  constructor(private http: HttpClient, private router: Router) {}


  // constructor(private authService: AuthService) {}

  login() {
    interface LoginResponse {
  message: string;
  token: string;
}

  this.http.post<LoginResponse>('http://localhost:5001/login', {
  email: this.email,
  password: this.password
}).subscribe({  
  next: res =>{      
      localStorage.setItem('token', res.token); // save JWT token
      alert('Login successful!');
      // window.location.href = '/profile'; // redirect
    this.router.navigate(['/profilepage']); // go to profile page
     // Clear the fields after login success
      this.email = '';
      this.password = '';},
      error: err => {
      console.error('❌ Login error', err);
      if (err.status === 400) {
        this.message = 'Invalid email or password!';
        alert(this.message);
      } else {
        this.message = 'Something went wrong. Please try again.';
        alert(this.message);

      }
    }
});

}

}
