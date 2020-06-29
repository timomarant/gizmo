import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AgmCoreModule } from '@agm/core';
import { CalculationModule } from './feature/calculation/calculation.module';
import { PersonModule } from './feature/person/person.module';
import { CustomerModule } from './feature/customer/customer.module';
import { HomeModule } from './feature/home/home.module';
import { InvoiceModule } from './feature/invoice/invoice.module';
import { SettingsModule } from './feature/settings/settings.module';
import { AppComponent } from './app.component';
import * as Sentry from '@sentry/browser';
import { AppConfig } from '../environments/environment';
import {
  ErrorService,
  AddHeaderInterceptor,
  HttpErrorResponseInterceptor,
  LogResponseInterceptor,
  SentryErrorHandler
} from './core/services';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

Sentry.init({ dsn: AppConfig.sentryDns });

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: AppConfig.googleApiKey
    }),
    HomeModule,
    CalculationModule,
    CustomerModule,
    InvoiceModule,
    PersonModule,
    SettingsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LogResponseInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
