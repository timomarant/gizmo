import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Constants {
  // public apiServer = 'https://localhost:44352/';
  public apiServer = 'https://gizmodevelopmentapi.azurewebsites.net/';
  public apiUrl = 'api/';
  public serverWithApiUrl = this.apiServer + this.apiUrl;
}
