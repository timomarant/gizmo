import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public apiServer = 'http://localhost:44352/';
    public apiUrl = 'api/';
    public serverWithApiUrl = this.apiServer + this.apiUrl;
}