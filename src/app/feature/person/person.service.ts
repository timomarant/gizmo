import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { IPerson } from "./Person";

@Injectable()
export class PersonService{
    
    //private url = 'https://localhost:44352/api/people';
    private url = 'https://gizmodevelopmentapi.azurewebsites.net/';

    constructor(
        private http: HttpClient
    ){ }

    getPeople(): Observable<HttpResponse<IPerson[]>>{
        return this.http.get<IPerson[]>(this.url,  { observe: 'response' }).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.handleError));
    }

    getPeoplePage(pageNumber: number): Observable<HttpResponse<IPerson[]>>{
        return this.http.get<IPerson[]>(this.url + "?PageNumber=" + pageNumber,  { observe: 'response' }).pipe(
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