import { Component, OnInit } from '@angular/core';
import { IPerson } from '../Person';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html'
})
export class PersonListComponent implements OnInit {

  public people: IPerson[];
  public errorMessage: string;

  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.personService.getPeople().subscribe({
      next: people => this.people = people,
      error: err => this.errorMessage = err
    });
  }

}
