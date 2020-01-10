import { Injectable, Optional, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { IPersonListModel } from "./person-list.model";

@Injectable()
export class PersonService{
    
    protected basePath = '/';

    constructor(
        private http: HttpClient,
        @Optional() basePath: string
    ){ 
        if (basePath) {
            this.basePath = basePath;
        }

        //this.basePath = 'https://localhost:44352';
        this.basePath = 'https://gizmodevelopmentapi.azurewebsites.net';
    }

    getPeople(pageNumber: number): Observable<HttpResponse<IPersonListModel[]>>{
        let params = new HttpParams();
        if (pageNumber !== undefined && pageNumber !== null) {
            params = params.set('PageNumber', <any>pageNumber);
        }

        return this.http.get<IPersonListModel[]>(`${this.basePath}/api/people`,  { params, observe: 'response' }).pipe(
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