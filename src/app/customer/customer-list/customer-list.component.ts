import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPagination } from '../../shared/models/pagination';
import { ICustomerForList } from '../models/customer-for-list';
import { CustomerForEdit } from '../models/customer-for-edit';
import { SearchComponent } from '../../shared/components/search/search.component';
import { StarComponent } from '../../shared/components/star/star.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { CustomerParameterService } from '../customer-parameter.service';
import { CustomerService, PagerService, ToastService } from '../../core';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(SearchComponent, { static: false }) searchComponent: SearchComponent;
    @ViewChild(StarComponent, { static: false }) starComponent: StarComponent;
    public customers: ICustomerForList[];
    public pagination: IPagination;
    public pager: any = {};
    public pagedItems: any[];
    public errorMessage: string;
    public searchComponentHelpText: string;
    public starComponentIsSelected: boolean;

    private sub: Subscription;

    get filter(): string {
        return this.customerParameterService.filter;
    }
    set filter(value: string) {
        this.customerParameterService.filter = value;
    }

    get searchTerm(): string {
        return this.customerParameterService.searchTerm || '';
    }
    set searchTerm(value: string) {
        this.customerParameterService.searchTerm = value;
    }

    get currentPageNumer(): number {
        return this.customerParameterService.currentPageNumber || 1;
    }
    set currentPageNumer(value: number) {
        this.customerParameterService.currentPageNumber = value;
    }

    constructor(
        private customerService: CustomerService,
        private pagerService: PagerService,
        private customerParameterService: CustomerParameterService,
        private toastService: ToastService,
        private route: ActivatedRoute) {
        this.searchComponentHelpText = 'Zoek op naam, telefoonnummer of e-mail adres';
    }

    ngOnInit() {
        this.sub = this.route
            .queryParams
            .subscribe(params => {
                if (params['filter']) {
                    this.filter = params['filter'] || 'all';
                }
                this.currentPageNumer = 1;
                this.getCustomers();
            });
    }

    ngAfterViewInit(): void {
        this.searchComponent.searchTerm = this.searchTerm;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public onSearchComponentValueChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.getCustomers();
    }

    public onStarComponentValueChange(event: any): void {
        this.customerService.setCustomerFavourite(event.modelId, event.isSelected).subscribe({
            next: () => {
                this.getCustomers();
            }
        });
    }

    public displayCustomers(page: number) {
        this.currentPageNumer = page;
        this.getCustomers();
    }

    public deleteCustomers(id: number) {
        this.customerService.getCustomer(id).subscribe({
            next: (customerForEdit: CustomerForEdit) => {
                customerForEdit.isDeleted = true;
                this.customerService.updateCustomer(customerForEdit).subscribe({
                    next: () => {
                        this.displayCustomers(1);
                        this.toastService.show(`${customerForEdit.name} is verwijderd.`);
                    }
                });
            }
        });
    }

    private getCustomers(): void {
        this.customerService.getCustomers(this.currentPageNumer, this.searchTerm, this.filter).subscribe({
            next: resp => {
                this.customers = resp.body;
                if (this.customers.length > 0) {
                    this.pagination = JSON.parse(resp.headers.get('X-Pagination'));
                    if (this.pagination) {
                        this.searchComponent.hitCount = this.pagination.totalCount;
                        // get pager object from service
                        this.pager = this.pagerService.getPager(
                          this.pagination.totalCount,
                          this.currentPageNumer,
                          this.pagination.pageSize);
                        // get current page of items
                        this.pagedItems = this.customers.slice(this.pager.startIndex, this.pager.endIndex + 1);
                    }
                } else {
                    this.searchComponent.hitCount = 0;
                }
            }
        });
    }
}
