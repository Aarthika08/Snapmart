// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { App } from './app/app';

// bootstrapApplication(App, appConfig)
//   .catch((err) => console.error(err));




// src/main.ts
// import 'zone.js';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { routes } from './app/app.routes';
// import { importProvidersFrom } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { provideRouter, withHashLocation } from '@angular/router';
// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes, withHashLocation()),
//     importProvidersFrom(HttpClientModule)  // <-- import HttpClientModule here
//   ]
// }).catch(err => console.error(err));
// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes, withHashLocation()),
//   ]
// }).catch(err => console.error(err));

import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
bootstrapApplication(AppComponent, {
   providers: [
    provideRouter(routes,withHashLocation())
  // provideHttpClient()// 👈 use this for Angular v15+
  ]
}).catch(err => console.error(err));

