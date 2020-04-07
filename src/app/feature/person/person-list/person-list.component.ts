import { Component, OnInit } from '@angular/core';
import { IPersonListModel } from '../person-list.model';
import { IPagination } from '../../../shared/models/pagination';
import { PersonService } from '../person.service';
import { PagerService } from '../../../core/services/pager/pager.service';
import { ICustomerForList } from '../../customer/models/customer-for-list';
import { CustomerService } from '../../../core/services';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html'
})
export class PersonListComponent implements OnInit {

  public people: IPersonListModel[];
  public customers: ICustomerForList[];
  public pagination: IPagination;
  public errorMessage: string;
  public pager: any = {};
  public pagedItems: any[];

  constructor(
    private personService: PersonService,
    private pagerService: PagerService,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    //this.setPage(1);
    this.displayCustomers(1);
  }

  public displayCustomers(page: number) {
    console.log('setPage');
  //  this.getCustomers(page);
  }

//   private getCustomers(page: number): void {
//     this.customerService.getCustomers(page, null).subscribe({
//       next: resp => {
//         this.customers = resp.body;
//         this.pagination = JSON.parse(resp.headers.get('X-Pagination'));
//         if (this.pagination) {
//           // get pager object from service
//           this.pager = this.pagerService.getPager(this.pagination.totalCount, page);
//           // get current page of items
//           this.pagedItems = this.customers.slice(this.pager.startIndex, this.pager.endIndex + 1);
//         }
//       },
//       error: err => this.errorMessage = err
//     });
//   }

  // public setPage(page: number) {
  //   console.log('setPage');

  //   this.personService.getPeople(page).subscribe({
  //     next: resp => {
  //       this.people = resp.body;
  //       this.pagination = JSON.parse(resp.headers.get('X-Pagination'));
  //       if (this.pagination) {
  //         // get pager object from service
  //         this.pager = this.pagerService.getPager(this.pagination.totalCount, page);
  //         // get current page of items
  //         this.pagedItems = this.people.slice(this.pager.startIndex, this.pager.endIndex + 1);
  //       }
  //     },
  //     error: err => this.errorMessage = err
  //   });
  // }

}
