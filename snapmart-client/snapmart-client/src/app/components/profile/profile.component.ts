// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../auth.service';
// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   providers: [AuthService],
//   imports: [CommonModule,HttpClientModule],
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss']
// })
// export class ProfileComponent implements OnInit {

//  profile: any;
//  selectedFile: File | null = null;
//  message: string = '';
//  serverUrl = 'http://localhost:5001'; 
  

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     //  this.getProfile();
     
//      const token = localStorage.getItem('token');

// this.http.get('http://localhost:5001/api/profile', {
//   headers: { Authorization: `Bearer ${token}` }
// })
// .subscribe(
//   (res: any) => {
//     this.profile = res;
//   },
//   (err) => {
//     console.error('Error fetching profile:', err);
//   }
// );

//   }


 

// onFileSelected(event: Event) {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files.length > 0) {
//     this.selectedFile = input.files[0];
//   }
// }

// uploadProfilePic() {
//   if (!this.selectedFile) {
//     alert('Please select a file first!');
//     return;
//   }

//   const formData = new FormData();
//   formData.append('profile_picture', this.selectedFile);

//   const token = localStorage.getItem('token');

//   this.http.post(`${this.serverUrl}/api/profile/pic`, formData, {
//     headers: { Authorization: `Bearer ${token}` }
//   }).subscribe({
//     next: (res: any) => {
//       console.log('Upload success', res);
//       this.profile.profile_picture = res.profile_picture;
//     },
//     error: (err) => {
//       console.error('Error uploading picture', err);
//     }
//   });
// }

// }

//   // ✅ Delete profile
//   deleteProfile() {
//     if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
//       const token = localStorage.getItem('token');
//       this.http.delete(`${this.serverUrl}/api/profile`, {
//         headers: { Authorization: `Bearer ${token}` }
//       }).subscribe({
//         next: () => {
//           alert('Profile deleted successfully!');
//           localStorage.removeItem('token');
//           window.location.href = '/login'; // redirect to login
//         },
//         error: (err) => {
//           console.error('Error deleting profile:', err);
//         }
//       });
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  selectedFile: File | null = null;
  serverUrl = 'http://localhost:5001';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getProfile();
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
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateProfile() {
    this.http.put(`${this.serverUrl}/api/profile`, { name: this.profile.name,
      address: this.profile.address,
      phone: this.profile.phone,
      bio: this.profile.bio }, this.tokenHeaders)
      .subscribe({
        next: () => alert('Profile updated successfully!'),
        error: (err) => console.error('Error updating profile', err)
      });
  }
  
  

updateProfilePic() {
  if (!this.selectedFile) return alert('Select a file first!');
  const formData = new FormData();
  formData.append('profile_picture', this.selectedFile);
  
  this.http.put(`${this.serverUrl}/api/profile/pic`, formData, this.tokenHeaders)
    .subscribe({
      next: (res: any) => {
        this.profile.profile_picture = res.profile_picture;
        alert('Profile picture updated!');
        // this.fileInput.nativeElement.value = '';
         // ✅ Clear selected file
        this.selectedFile = null;

        // ✅ Clear file input element
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
       
      },
      error: (err) => console.error('Error uploading picture', err)
    });

 this.profile.profile_picture="";
}




//   deleteProfilePic() {
//   if (confirm('Are you sure you want to delete your profile picture?')) {
//     const token = localStorage.getItem('token');
//     this.http.delete(`${this.serverUrl}/api/profile/pic`, {
//       headers: { Authorization: `Bearer ${token}` }
//     }).subscribe({
//       next: () => {
//         alert('Profile picture deleted!');
//         this.profile.profile_picture = null;
//       },
//       error: (err) => {
//         console.error('Error deleting profile picture:', err);
//       }
//     });
//   }
// }


  deleteProfilePic() {
    this.http.delete(`${this.serverUrl}/api/profile/pic`, this.tokenHeaders)
      .subscribe({
        next: () => {
          this.profile.profile_picture = null;
          alert('Profile picture deleted!');
        },
        error: (err) => console.error('Error deleting picture', err)
      });
  }


}
