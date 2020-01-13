import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'

import { PersonDetailModel } from '../person-detail.model';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html'
})
export class PersonDetailComponent implements OnInit {
  public personForm: FormGroup;
  public personDetail = new PersonDetailModel();
  public firstNameMessage: string;

  validationMessages = {
    required: 'Vul alstublieft uw voornaam in.',
    maxLength: 'De maximumlengte is 50.'
  }

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.personForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailOne: ['', [Validators.email, Validators.maxLength(100)]],
    });

    const firstNameControl = this.personForm.get('firstName');
    firstNameControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(firstNameControl)
    );
  }

  public save() {
    console.log(this.personForm);
    console.log('saved: ' + JSON.stringify(this.personForm.value));
  }

   setMessage(c: AbstractControl): void {
    this.firstNameMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.firstNameMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }
}
