import { Injectable } from '@angular/core';
import { municipalities_be } from './municipalities-be';

@Injectable({ providedIn: 'root' })
export class MunicipalityService {

    constructor() { }

    getMunicipalities(countryCode: string) {
        return municipalities_be;
    }
}