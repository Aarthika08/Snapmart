

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private baseUrl = 'http://localhost:5001';

//   constructor(private http: HttpClient) {}

//   register(user: { name: string; email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.baseUrl}/register`, user);
//   }

//   login(credentials: { email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.baseUrl}/login`, credentials);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  name?: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5001';

  constructor(private http: HttpClient) {}

  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}

