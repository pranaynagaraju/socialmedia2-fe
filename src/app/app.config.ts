import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideClientHydration(),
    provideToastr(),
    provideAnimations(),
    provideAnimations(), // Required for Toastr
    provideToastr({
      positionClass: 'toast-top-right', // Ensure it's at the top
      preventDuplicates: true, // Prevent duplicate toasts
      timeOut: 3000, // Auto close after 3s
    })
  ]
};
