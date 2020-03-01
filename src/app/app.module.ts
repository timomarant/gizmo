import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmDecHs1UWI64oUe8kVIvnUYTwfrsFX0E'
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
    }),
    NgbModule
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
