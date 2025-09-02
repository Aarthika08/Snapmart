
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../auth.service';

// @Component({
//   selector: 'app-register',
//   standalone:true,
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss'],
//   imports: [FormsModule,CommonModule] 
// })
// export class RegisterComponent {
//   fullname: string = '';
//   email: string = '';
//   password: string = '';
//   confirmPassword: string = '';

//   passwordsMatch(): boolean {
//     return this.password === this.confirmPassword;
//   }

//   onSubmit() {
//     if (this.passwordsMatch()) {
//       // Here you can add registration logic, like calling an API
//       console.log('Full Name:', this.fullname);
//       console.log('Email:', this.email);
//       console.log('Password:', this.password);
//       alert('Registration successful (mock)');
//     }
//   }
// }


import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClientModule ,HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone:true,
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [FormsModule,CommonModule,HttpClientModule] 
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  message = '';
  confirmPassword: string = '';

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  // constructor(private authService: AuthService,) {}
  // register() {
  //   this.authService.register({ name: this.name, email: this.email, password: this.password })
  //     .subscribe({
  //       next: (res) => this.message = 'Registration successful!',
  //       error: (err) => this.message = 'Error: ' + err.error.message || err.message
  //     });
  // }



constructor(private http: HttpClient) {}

register() {
  const user = {
    name: this.name,
    email: this.email,
    password: this.password
  };

  this.http.post('http://localhost:5001/register', user, {
    headers: { 'Content-Type': 'application/json' }
  })
  .subscribe({
    next: (res) => {
      console.log('✅ Registered:', res); 
      this.name = '';
      this.email = '';
      this.password = '';},
    error: (err) => {
      console.error('❌ Error registering:', err);
    }
  });
}

}
