import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ICustomerForList } from '../../../feature/customer/models/customer-for-list';
import { CustomerForEdit } from '../../../feature/customer/models/customer-for-edit';
import { Constants } from '../app.constants';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private actionUrl: string;

    constructor(
        private http: HttpClient,
        private constants: Constants
    ) {
        this.actionUrl = constants.serverWithApiUrl + 'customers/';
    }

    getCustomers(pageNumber: number, searchTerm?: string, filter?: string, isRecent?: boolean): Observable<HttpResponse<ICustomerForList[]>> {
        let params = new HttpParams();
        if (pageNumber !== undefined && pageNumber !== null) {
            params = params.set('PageNumber', <any>pageNumber);
        }
        params = params.set('PageSize', <any>20);
        if (searchTerm !== undefined && searchTerm !== null) {
            params = params.set('SearchTerm', <any>searchTerm);
        }
        if (filter !== undefined && filter !== null) {
            params = params.set('IsFavourite', <any>(filter === 'favourite'));
        }
        if (isRecent !== undefined && isRecent !== null) {
            params = params.set('IsRecent', <any>isRecent);
        }

        return this.http.get<ICustomerForList[]>(this.actionUrl, { params, observe: 'response' });
    }

    getCustomer(id: number): Observable<CustomerForEdit> {
        if (id === 0) { return of(this.initializeCustomer()); }
        return this.http.get<CustomerForEdit>(this.actionUrl + id);
    }

    createCustomer(customerForEdit: CustomerForEdit): Observable<CustomerForEdit> {
        customerForEdit.id = null;
        return this.http.post<CustomerForEdit>(this.actionUrl, customerForEdit);
    }

    updateCustomer(customerForEdit: CustomerForEdit): Observable<CustomerForEdit> {
        console.log(customerForEdit)
        return this.http.put<CustomerForEdit>(this.actionUrl + customerForEdit.id, customerForEdit).pipe(map(() => customerForEdit));
    }

    setCustomerFavourite(customerId: number, isFavourite: boolean): Observable<any> {
        const patchDocument = [{ "op": "replace", "path": "/isFavourite", "value": isFavourite }];
        return this.partiallyUpdateCustomer(customerId, patchDocument);
    }

    private partiallyUpdateCustomer(customerId: number, patchDocument: any): Observable<any> {
        return this.http.patch<any>(this.actionUrl + customerId, patchDocument);
    }

    private initializeCustomer(): CustomerForEdit {
        return {
            id: 0,
            name: null,
            address: null,
            city: null,
            postalCode: null,
            countryTwoLetterCode: 'be',
            phoneOne: null,
            phoneTwo: null,
            phoneThree: null,
            emailOne: null,
            emailTwo: null,
            emailThree: null,
            isFavourite: false,
            isDeleted: false
        };
    }
}
