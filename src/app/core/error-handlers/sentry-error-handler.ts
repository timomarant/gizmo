import { Injectable, ErrorHandler } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { FriendlyError } from '../../shared/models/friendly-error';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';

@Injectable({
    providedIn: 'root'
})
export class SentryErrorHandler implements ErrorHandler {
    constructor(private notificationService: NotificationService) { }

    handleError(error) {
        console.log(error);
        if (error instanceof FriendlyError) {
            console.log('-- FriendlyError: ' + error.message);
            this.notificationService.danger(error.message);
        } else if (error instanceof HttpErrorResponse) {
            console.log('-- HttpErrorResponse: ' + error.status);
        } else {
            console.error('-- An error occurred here');
        }
    }
}
