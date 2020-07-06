import { Component, OnInit } from '@angular/core';
import { PersonService } from './person.service';
import { PagerService } from '../../core/services/pager.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  providers: [ PersonService, PagerService]
})
export class PersonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
