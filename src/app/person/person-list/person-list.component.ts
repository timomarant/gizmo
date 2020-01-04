import { Component, OnInit } from '@angular/core';
import { IPerson } from '../Person';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html'
})
export class PersonListComponent implements OnInit {

  public people: IPerson[];

  constructor() { 
    
  }

  ngOnInit() {
    // this.dataService
    //         .getAll<any[]>()
    //         .subscribe((data: any[]) => this.people = data,
    //         error => () => {
    //            // this.toasterService.pop('error', 'Damn', 'Something went wrong...');
    //            console.log('error');
    //         },
    //         () => {
    //           //  this.toasterService.pop('success', 'Complete', 'Getting all people complete');
    //            // this.slimLoadingBarService.complete();
    //            console.log('success');
    //         });
  }

}
