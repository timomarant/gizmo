import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../core/services/customer.service';
import { IPagination } from '../../shared/pagination';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    public pagination: IPagination;
    public totalCustoners: string;
    public errorMessage: string;

    constructor(private customerService: CustomerService) {
        this.totalCustoners = "...";
     }

    ngOnInit() {
        this.initCustomers();
    }

    initCustomers() {
        this.customerService.getCustomers(1, '').subscribe({
            next: resp => {
                this.pagination = JSON.parse(resp.headers.get('X-Pagination'));
                if (this.pagination) {
                   this.totalCustoners = this.pagination.totalCount.toString();
                }
            },
            error: err => this.errorMessage = err
        });
    }

}
