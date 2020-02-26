import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public customers: ICustomerForList[];
    public pagination: IPagination;
    public pager: any = {};
    public pagedItems: any[];
    public errorMessage: string;
    public searchForm: FormGroup;
    private searchTerm: string;

    public userQuestion: string;
    userQuestionUpdate = new Subject<string>();

    constructor(
        private fb: FormBuilder,
        private customerService: CustomerService,
        private pagerService: PagerService) {
            this.searchTerm = null;
            this.userQuestionUpdate.pipe(
                debounceTime(400),
                distinctUntilChanged())
                .subscribe(value => {
                    this.searchTerm = value;
                    this.getCustomers(1, value);
                });
    }

    ngOnInit() {
        this.displayCustomers(1);
        this.searchForm = this.fb.group({userQuestion: ['', ]});
    }

    public searchCustomers(): void {
        this.searchTerm = this.searchForm.get('userQuestion').value;
        this.getCustomers(1, this.searchTerm);
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
                    this.pager = this.pagerService.getPager(this.pagination.totalCount, page);
                    // get current page of items
                    this.pagedItems = this.customers.slice(this.pager.startIndex, this.pager.endIndex + 1);
                }
            },
            error: err => this.errorMessage = err
        });
    }
}
