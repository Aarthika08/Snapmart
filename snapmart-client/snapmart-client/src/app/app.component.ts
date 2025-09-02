// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App {
//   protected readonly title = signal('snapmart-client');
// }



// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterModule],
//   template: `
//     <nav>
//       <a routerLink="/login">Login</a> |
//       <a routerLink="/register">Register</a>
//     </nav>
//     <router-outlet></router-outlet>
//   `,
//   styles: [`
//     nav { padding: 10px; }
//     a { margin: 0 10px; }
//   `]
// })
// export class AppComponent {}


import { Component,OnInit,signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from './components/profilepage/profile.service';
import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet,RouterModule],
//   template: `<router-outlet></router-outlet>`
// })
// export class AppComponent {}


@Component({
  selector: 'app-root',
  standalone: true,   // standalone component
  imports: [CommonModule,RouterOutlet,RouterModule],  // 🔹 add this
 template: `<router-outlet></router-outlet>`
})
export class AppComponent {
// implements OnInit {
//   user: any;

//   constructor(private profileService: ProfileService) {}

// ngOnInit() {
//   this.profileService.getUserById(1).subscribe({
//     next: (data) => this.user = data,
//     error: (err) => console.error(err)
//   });
// }

}
