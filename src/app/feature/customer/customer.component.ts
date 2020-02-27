import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../core/services/customer.service';
import { PagerService } from '../../shared/services/pagerservice';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  providers: [ CustomerService, PagerService]
})
export class CustomerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
