import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class GizmoAppErrorHandlerService implements ErrorHandler {

    handleError(error: any): void {
        console.log('global error:' + error);
        throw error;
    }

    constructor() { }
}
