import { Component, OnInit } from '@angular/core';

import { IPersonListModel } from '../person-list.model';
import { IPagination } from '../../../shared/pagination';
import { PersonService } from '../person.service';
import { PagerService } from '../../../shared/services/pagerservice';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html'
})
export class PersonListComponent implements OnInit {

  public people: IPersonListModel[];
  public pagination: IPagination;
  public errorMessage: string;
  public pager: any = {};
  public pagedItems: any[];

  constructor(
    private personService: PersonService,
    private pagerService: PagerService
  ) { }

  ngOnInit() {
    this.setPage(1);
  }

  public setPage(page: number) {
    console.log('setPage');

    this.personService.getPeople(page).subscribe({
      next: resp => {
        this.people = resp.body;
        this.pagination = JSON.parse(resp.headers.get('X-Pagination'));
        if (this.pagination) {
          // get pager object from service
          this.pager = this.pagerService.getPager(this.pagination.totalCount, page);
          // get current page of items
          this.pagedItems = this.people.slice(this.pager.startIndex, this.pager.endIndex + 1);
        }
      },
      error: err => this.errorMessage = err
    });

  }
}
