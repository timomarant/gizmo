import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators'
import { Subscription } from 'rxjs/internal/Subscription';

import { PersonDetailModel } from '../person-detail.model';

@Component({
    templateUrl: './person-new.component.html'
})
export class PersonNewComponent implements OnInit, OnDestroy {
    public personForm: FormGroup;
    public personDetail = new PersonDetailModel();
    public firstNameMessage: string;
    public lastNameMessage: string;
    public titleMessage: string;

    private sub: Subscription;

    firstNameValidationMessages = {
        required: 'Vul alstublieft uw voornaam in.',
        maxLength: 'De maximumlengte is 50.'
    }

    // lastNameValidationMessages = {
    //     maxLength: 'De maximumlengte is 50.'
    // }

    // titleValidationMessages = {
    //     maxLength: 'De maximumlengte is 20.'
    // }

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.personForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.maxLength(50)]],
            title: ['', [Validators.maxLength(20)]],
            address: ['', [Validators.maxLength(100)]],
            country: ['', [Validators.maxLength(100)]],
            city: ['', [Validators.maxLength(100)]],
            postalCode: ['', [Validators.maxLength(100)]],
            phoneOne: ['', [Validators.maxLength(100)]],
            emailOne: ['', [Validators.email, Validators.maxLength(100)]],
        });

        const firstNameControl = this.personForm.get('firstName');
        firstNameControl.valueChanges.pipe(
            debounceTime(1000)
        ).subscribe(
            value => this.setMessage(firstNameControl)
        );

        // const lastNameControl = this.personForm.get('lastName');
        // lastNameControl.valueChanges.pipe(
        //     debounceTime(1000)
        // ).subscribe(
        //     value => this.setMessage(lastNameControl, this.lastNameMessage, this.lastNameValidationMessages)
        // );

        // Read the product Id from the route parameter
        this.sub = this.route.paramMap.subscribe(
            params => {
                const id = +params.get('id');
                //this.getProduct(id);
            }
        );
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    setMessage(c: AbstractControl): void {
        this.firstNameMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.firstNameMessage = Object.keys(c.errors).map(key => this.firstNameValidationMessages[key]).join(' ');
        }
    }
}