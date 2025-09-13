
// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import {ProfilePageComponent} from './components/profilepage/profilepage.component';
import { authGuard } from './auth/auth.guard';
import {ProductList} from '../app/productcomponents/product-list/product-list.component';
import {HomepageComponent} from './homepage/homepage.component';
export const routes: Routes = [
{path:'home',component:HomepageComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
   {path:'product',component:ProductList},
  {path:'profile',component:ProfileComponent,canActivate: [authGuard] },
{path:'profilepage',component:ProfilePageComponent,canActivate: [authGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' } // wildcard route for 404 fallback
];
