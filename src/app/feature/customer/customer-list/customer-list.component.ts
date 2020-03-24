import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PagerService } from '../../../shared/services/pagerservice';
import { IPagination } from '../../../shared/pagination';
import { CustomerService } from '../../../core/services/customer.service';
import { ICustomerForList } from '../models/customer-for-list';
import { CustomerForEdit } from '../models/customer-for-edit';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit, AfterViewInit {   
    @ViewChild(SearchComponent, { static: false }) searchComponent: SearchComponent;
    public customers: ICustomerForList[];
    public pagination: IPagination;
    public pager: any = {};
    public pagedItems: any[];
    public errorMessage: string;
    public helpTextString: string;
    private searchTerm: string;

    constructor(
        private customerService: CustomerService,
        private pagerService: PagerService) {
    }

    ngOnInit() {
        this.displayCustomers(1);
    }

    ngAfterViewInit(): void {
        this.helpTextString = 'Zoek op naam, telefoonnummer of e-mail adres.';
        this.searchTerm = this.searchComponent.searchTerm;
    }

    public onValueChange(value: string): void {
        this.getCustomers(1, value);
    }

    public displayCustomers(page: number) {
        this.getCustomers(page, this.searchTerm);
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

    private getCustomers(page: number, searchTerm: string): void {
        this.customerService.getCustomers(page, searchTerm).subscribe({
            next: resp => {
                this.customers = resp.body;
                this.pagination = JSON.parse(resp.headers.get('X-Pagination'));
                if (this.pagination) {
                    // get pager object from service
                    this.pager = this.pagerService.getPager(this.pagination.totalCount, page, this.pagination.pageSize);
                    // get current page of items
                    this.pagedItems = this.customers.slice(this.pager.startIndex, this.pager.endIndex + 1);
                }
            },
            error: err => this.errorMessage = err
        });
    }
}
