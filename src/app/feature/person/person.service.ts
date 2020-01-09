import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { IPerson } from "./person";

@Injectable()
export class PersonService{
    
    //private url = 'https://localhost:44352/api/people';
    private url = 'https://gizmodevelopmentapi.azurewebsites.net/api/people';

    constructor(
        private http: HttpClient
    ){ }

    getPeople(): Observable<HttpResponse<IPerson[]>>{
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', this.url);

        return this.http.get<IPerson[]>(this.url,  { headers, observe: 'response' }).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.handleError));
    }

    getPeoplePage(pageNumber: number): Observable<HttpResponse<IPerson[]>>{
        let params = new HttpParams().set('PageNumber', pageNumber.toString());
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', this.url);

        return this.http.get<IPerson[]>(this.url,  { params, headers, observe: 'response' }).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse){
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occured: ${err.error.message}`;
        } else{
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }

        console.error(errorMessage);
        return throwError(errorMessage);
    }
}