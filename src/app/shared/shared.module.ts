import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { SearchComponent } from './components/search/search.component';
import { StarComponent } from './components/star/star.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import * as Sentry from '@sentry/browser';
import { ErrorService, AddHeaderInterceptor, HttpErrorResponseInterceptor, LogResponseInterceptor } from '../core/services';

Sentry.init({
    dsn: "https://466c648c8584475ab3a8293a91ae228b@o374410.ingest.sentry.io/5192411"
});

Sentry.configureScope((scope) => {
   //scope.setUser({ 'email': 'timo.marant@gmail.com' });
});


@Injectable()
export class SentryErrorHandler implements ErrorHandler {
    constructor() { }
    handleError(error) {
        const eventId = Sentry.captureException(error.originalError || error);
        Sentry.showReportDialog({ eventId });
    }
}

@NgModule({
    declarations: [
        WebviewDirective,
        PageNotFoundComponent,
        SearchComponent,
        StarComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule
    ],
    exports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        WebviewDirective,
        SearchComponent,
        StarComponent
    ],
    providers: [       
        { provide: ErrorHandler, useClass: ErrorService },
        { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorResponseInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LogResponseInterceptor, multi: true }
    ]
})
export class SharedModule { }
