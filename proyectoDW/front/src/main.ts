import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { isDevMode, mergeApplicationConfig } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

defineCustomElements(window);

const appWithServiceWorker = mergeApplicationConfig(appConfig, {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
});

bootstrapApplication(App, appWithServiceWorker).catch((err) => console.error(err));
