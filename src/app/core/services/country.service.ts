import { Injectable } from '@angular/core';
import { countries_eu } from './countries-eu';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() { }

  getCountries() {
    return countries_eu;
  }
}
