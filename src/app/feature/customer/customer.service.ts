import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ICustomerForList } from './customer-for-list';
import { CustomerForEdit } from './customer-for-edit';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersUrl = 'https://gizmodevelopmentapi.azurewebsites.net/api/customers';

  constructor(
    private http: HttpClient
  ) { }

  getCustomers(pageNumber: number): Observable<HttpResponse<ICustomerForList[]>> {
    let params = new HttpParams();
    if (pageNumber !== undefined && pageNumber !== null) {
      params = params.set('PageNumber', <any>pageNumber);
    }

    return this.http.get<ICustomerForList[]>(this.customersUrl, { params, observe: 'response' }).pipe(
      tap(data => console.log('getCustomers: ' + JSON.stringify(data))),
      catchError(this.handleError));
  }

  getCustomer(id: number): Observable<CustomerForEdit> {
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

  // createProduct(IPersonListModel: IPersonListModel): Observable<IPersonListModel> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   IPersonListModel.id = null;
  //   return this.http.post<IPersonListModel>(this.customersUrl, IPersonListModel, { headers })
  //     .pipe(
  //       tap(data => console.log('createProduct: ' + JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // }

  // deleteProduct(id: number): Observable<{}> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const url = `${this.customersUrl}/${id}`;
  //   return this.http.delete<IPersonListModel>(url, { headers })
  //     .pipe(
  //       tap(data => console.log('deleteProduct: ' + id)),
  //       catchError(this.handleError)
  //     );
  // }

  // updateProduct(IPersonListModel: IPersonListModel): Observable<IPersonListModel> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const url = `${this.customersUrl}/${IPersonListModel.id}`;
  //   return this.http.put<IPersonListModel>(url, IPersonListModel, { headers })
  //     .pipe(
  //       tap(() => console.log('updateProduct: ' + IPersonListModel.id)),
  //       // Return the IPersonListModel on an update
  //       map(() => IPersonListModel),
  //       catchError(this.handleError)
  //     );
  // }

  private handleHttpErrorResponse(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occured: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private handleError(err) {
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
      companyName: null,
      personFirstName: null,
      personLastName: null,
      personTitle: null,
      address: null,
      city: null,
      postalCode: null,
      country: null,
      emailOne: null,
      emailTwo: null,
      emailThree: null,
      phoneOne: null,
      phoneTwo: null,
      phoneThree: null,
    };
  }
}
