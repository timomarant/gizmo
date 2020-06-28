import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FriendlyError } from '../../../shared/models/friendly-error';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  constructor(
    private notificationService: NotificationService,
    private injector: Injector) { }

  handleError(error: any): void {
    console.log('-- Global Error:' + error);

    // const router = this.injector.get(Router);

    if (error instanceof FriendlyError) {
      console.log('-- FriendlyError: ' + error.message);
    } else if (error instanceof HttpErrorResponse) {
      console.log('-- HttpErrorResponse: ' + error.status);
    } else {
      console.error('-- An error occurred here');
    }

    // router.navigate(['error']);
    throw error;
  }
}
