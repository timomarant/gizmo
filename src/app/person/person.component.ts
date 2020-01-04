import { Component, OnInit } from '@angular/core';
import { PersonService } from './person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  providers: [ PersonService]
})
export class PersonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
