import { IPerson } from "./Person";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";

export class PersonService{
    
    private url = 'https://localhost:44352/api/people';

    constructor(private http: HttpClient){ }

    getPeople(): Observable<IPerson[]>{
        return this.http.get<IPerson[]>(this.url).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse){
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occured: ${err.error.message}`;
        } else{
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.error.message}`;
        }

        console.error(errorMessage);
        return throwError(errorMessage);
    }
}