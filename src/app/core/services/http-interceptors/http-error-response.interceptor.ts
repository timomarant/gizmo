import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs/internal/Observable';
import { FriendlyError } from '../../../shared/models/friendly-error';
import * as Sentry from '@sentry/browser';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorResponseInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`-- HttpErrorResponseInterceptor - ${req.url}`);

        return next.handle(req).pipe(            
            catchError((error: HttpErrorResponse) => {
                const friendlyError = new FriendlyError();
                if (error instanceof HttpErrorResponse) {
                    // server-side error
                    friendlyError.status = error.status;
                    friendlyError.message = error.message;
                    friendlyError.friendlyMessage = `Error Status: ${error.status} - Message: ${error.message}`;

                    Sentry.captureException(error);

                    return throwError(friendlyError);
                }
                else {
                    // client-side error                       

                    return throwError(error);
                }
            })
        )
    };
}