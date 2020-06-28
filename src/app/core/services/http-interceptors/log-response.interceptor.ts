import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
    providedIn: 'root'
})
export class LogResponseInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`-- LogResponseInterceptor - ${req.url}`);

        return next.handle(req).pipe(
            tap((event) => {
                if (event.type === HttpEventType.Response) {
                    console.log(event.body);
                }
            })
        );
    }
}
