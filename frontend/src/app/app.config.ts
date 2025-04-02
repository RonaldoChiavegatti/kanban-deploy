import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFirebaseApp } from '@angular/fire/app';
import { Apollo } from 'apollo-angular';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authInterceptor } from './services/auth.interceptor';
import { GraphQLModule } from './graphql.module';

// Obter a configuração do Firebase de window.ENV ou fallback para environment
const firebaseConfig = (window as any).ENV?.firebase || environment.firebase;

// Inicializar o Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Configuração para desabilitar logs do Firebase Zone
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    
    // Firebase
    provideFirebaseApp(() => firebaseApp),
    provideAuth(() => getAuth(firebaseApp)),
    provideFirestore(() => getFirestore(firebaseApp)),
    provideStorage(() => getStorage(firebaseApp)),
    
    // Adicionar configuração para desabilitar logs
    {
      provide: FIREBASE_OPTIONS,
      useValue: {
        ...firebaseConfig,
        logLevel: 'silent' // 'silent', 'error', 'warn', 'info', 'debug', 'verbose'
      }
    },
    
    // GraphQL
    importProvidersFrom(GraphQLModule),
    Apollo
  ]
}; 