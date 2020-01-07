import { Component, OnInit } from '@angular/core';

import { IPerson } from '../Person';
import { IPagination } from '../../../shared/pagination';
import { PersonService } from '../person.service';
import { PagerService } from '../../../shared/services/pagerservice';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html'
})
export class PersonListComponent implements OnInit {

  people: IPerson[];
  pagination: IPagination;
  errorMessage: string;
  
  pager: any = {}; // pager object
  pagedItems: any[]; // paged items

  constructor(
    private personService: PersonService,
    private pagerService: PagerService
  ) { }

  ngOnInit() {
    this.personService.getPeople().subscribe({
      next: resp => {
        this.people = resp.body;
        this.pagination =  JSON.parse(resp.headers.get('X-Pagination'));
        this.setPage(1);
        console.log(this.pagination);
      },
      error: err => this.errorMessage = err
    });
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.pagination.totalCount, page);
    // get current page of items
    this.pagedItems = this.people.slice(this.pager.startIndex, this.pager.endIndex + 1);

    console.log('set page');
    
    this.personService.getPeoplePage(page).subscribe({
      next: resp => {
        this.people = resp.body;
        this.pagination =  JSON.parse(resp.headers.get('X-Pagination'));
      },
      error: err => this.errorMessage = err
    });

  }
}
