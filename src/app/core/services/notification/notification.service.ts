import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private successMessage = new Subject<string>();
    private infoMessage = new Subject<string>();
    private dangerMessage = new Subject<string>();
    
    successMessageChanges$ = this.successMessage.asObservable();
    infoMessageChanges$ = this.infoMessage.asObservable();
    dangerMessageChanges$ = this.dangerMessage.asObservable();
    
    success(message: string): void {
        this.successMessage.next(message);
    }

    info(message: string): void {
        this.infoMessage.next(message);
    }

    danger(message: string): void {
        this.dangerMessage.next(message);
    }
}