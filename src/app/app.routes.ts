
// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import {ProfilePageComponent} from './components/profilepage/profilepage.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'profile',component:ProfileComponent,canActivate: [authGuard] },
{path:'profilepage',component:ProfilePageComponent,canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
  // { path: '**', redirectTo: 'login' } // wildcard route for 404 fallback
];
