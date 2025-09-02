// import { ProfileService } from './profile.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  

@Component({
  selector: 'app-profilepage',
  standalone: true,
  imports: [CommonModule,FormsModule ,HttpClientModule,RouterModule],
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.scss'
})
  
export class ProfilePageComponent implements OnInit {
  activeTab: 'timeline' | 'about' = 'about';   // default to About 
  profile: any={};
    selectedFile: File | null = null;
    serverUrl = 'http://localhost:5001';
  
    constructor (private http: HttpClient) {}
  
    ngOnInit() {
      this.getProfile();
      // this.profileService.getProfile(1).subscribe({
      //   next: (data) => this.profile = data,
      //   error: (err) => console.error('Error fetching profile:', err)
      // });
    }
    


  
  get tokenHeaders(){
    const token = localStorage.getItem('token'); // Make sure this exists
    if (!token) {
      console.error('No token found!');
      return {};
    }
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
  
  
  getProfile() {
    this.http.get(`${this.serverUrl}/api/profile`, this.tokenHeaders)
      .subscribe({
        next: (res) => this.profile = res,
        error: (err) => console.error('Error fetching profile:', err)
      });
  }
  


 toDate(d?: string | null) {
    return d ? new Date(d) : null;
  }

  switchTab(tab: 'timeline' | 'about') {
    this.activeTab = tab;
  }


  logout() {
  localStorage.removeItem('token');  // remove JWT
  window.location.href = '/login';   // redirect to login
}


}

  
  
  

