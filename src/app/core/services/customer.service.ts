import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ICustomerForList } from '../../feature/customer/models/customer-for-list';
import { CustomerForEdit } from '../../feature/customer/models/customer-for-edit';

@Injectable()
export class CustomerService {
    //private customersUrl = 'https://localhost:44352/api/customers';
    private customersUrl = 'https://gizmodevelopmentapi.azurewebsites.net/api/customers';

    constructor(
        private http: HttpClient
    ) { }

    public getCustomers(pageNumber: number, searchTerm?: string, filter?: string, isRecent?: boolean): Observable<HttpResponse<ICustomerForList[]>> {
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

        return this.http.get<ICustomerForList[]>(this.customersUrl, { params, observe: 'response' }).pipe(
            //tap(data => console.log('getCustomers: ' + JSON.stringify(data))),
            catchError(this.handleError));
    }

    public getCustomer(id: number): Observable<CustomerForEdit> {
        if (id === 0) {
            return of(this.initializeCustomer());
        }
        const url = `${this.customersUrl}/${id}`;
        return this.http.get<CustomerForEdit>(url)
            .pipe(
                tap(data => console.log('getCustomer: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

    public updateCustomer(customerForEdit: CustomerForEdit): Observable<CustomerForEdit> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.customersUrl}/${customerForEdit.id}`;
        return this.http.put<CustomerForEdit>(url, customerForEdit, { headers })
            .pipe(
                tap(() => console.log('updateCustomer: ' + customerForEdit.id)),
                // Return the CustomerForEdit on an update
                map(() => customerForEdit),
                catchError(this.handleError)
            );
    }

    public setCustomerFavourite(customerId: number, isFavourite: boolean) :void{
        const patchDocument = [{ "op": "replace", "path": "/isFavourite", "value": isFavourite }];
        this.partiallyUpdateCustomer(customerId, patchDocument).subscribe();
    }

    private partiallyUpdateCustomer(customerId: number, patchDocument: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.customersUrl}/${customerId}`;
        return this.http.patch<any>(url, patchDocument, { headers })
            .pipe(
                tap(() => console.log('partiallyUpdateCustomer: ' + customerId)),
                catchError(this.handleError)
            );
    }

    public createCustomer(customerForEdit: CustomerForEdit): Observable<CustomerForEdit> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        customerForEdit.id = null;
        return this.http.post<CustomerForEdit>(this.customersUrl, customerForEdit, { headers })
            .pipe(
                tap(data => console.log('createCustomer: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

    private handleError(err: any) {
        console.log(err);
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
        }
        console.error(err);
        return throwError(errorMessage);
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
