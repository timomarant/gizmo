import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class CustomerParameterService implements OnDestroy {
    searchTerm: string;
    filter: string;
    currentPageNumber: number;

    constructor() {
        console.log('-- CustomerParameterService created.');
    }

    ngOnDestroy(): void {
        console.log('-- CustomerParameterService destroyed.');
    }
}
