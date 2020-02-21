import { Component, OnInit } from '@angular/core';
import { PagerService } from '../../../shared/services/pagerservice';
import { IPagination } from '../../../shared/pagination';
import { CustomerService } from '../customer.service';
import { ICustomerForList } from '../customer-for-list';
import { CustomerForEdit } from '../customer-for-edit';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {

    public customers: ICustomerForList[];
    public pagination: IPagination;
    public pager: any = {};
    public pagedItems: any[];
    public errorMessage: string;

    constructor(
        private customerService: CustomerService,
        private pagerService: PagerService,
    ) { }

    ngOnInit() {
        this.displayCustomers(1);
    }

    public displayCustomers(page: number) {
        this.getCustomers(page);
    }

    public deleteCustomers(id: number) {
        this.customerService.getCustomer(id).subscribe({
            next: (customerForEdit: CustomerForEdit) => {
                customerForEdit.isDeleted = true;
                this.customerService.updateCustomer(customerForEdit).subscribe({
                    next: () => this.displayCustomers(1),
                    error: err => this.errorMessage = err
                })
            },
            error: err => this.errorMessage = err
        });
    }

    private getCustomers(page: number): void {
        this.customerService.getCustomers(page).subscribe({
            next: resp => {
                this.customers = resp.body;
                this.pagination = JSON.parse(resp.headers.get('X-Pagination'));
                if (this.pagination) {
                    // get pager object from service
                    this.pager = this.pagerService.getPager(this.pagination.totalCount, page);
                    // get current page of items
                    this.pagedItems = this.customers.slice(this.pager.startIndex, this.pager.endIndex + 1);
                }
            },
            error: err => this.errorMessage = err
        });
    }
}
