import { Component, OnInit } from '@angular/core';
import { IPagination } from '../../shared/models/pagination';
import { CustomerService } from '../../core/services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    public pagination: IPagination;
    public totalCustomers: string;
    public recentCustomers: string;
    public favouriteCustomers: string;
    public errorMessage: string;

    constructor(private customerService: CustomerService) {
        this.totalCustomers = '...';
     }

    ngOnInit() {
        this.initCustomers();
    }

    initCustomers() {
        this.customerService.getCustomers(1).subscribe({
            next: resp => {
                this.pagination = JSON.parse(resp.headers.get('X-Pagination'));
                this.recentCustomers = resp.headers.get('X-Recent-Count');
                this.favouriteCustomers = resp.headers.get('X-Favourite-Count');
                if (this.pagination) {
                   this.totalCustomers = this.pagination.totalCount.toString();
                }
            },
            error: err => this.errorMessage = err
        });
    }
}
