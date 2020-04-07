import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators'
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';

import { PersonDetailModel } from '../person-detail.model';
import { GenericValidator } from '../../../shared/models/generic-validator';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { merge } from 'rxjs/internal/observable/merge';
import { CustomerService } from '../../../core/services';

@Component({
    templateUrl: './person-edit.component.html',
    styles: [`
    agm-map {
      height: 400px;
    }
  `]
})
export class PersonEditComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public personForm: FormGroup;
    public personDetail = new PersonDetailModel();

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    public displayMessage: { [key: string]: string } = {};

    private sub: Subscription;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private customerService: CustomerService
    ) {
        this.validationMessages = {
            firstName: {
                required: 'Vul alstublieft uw voornaam in.',
                maxlength: 'De maximumlengte is 50.'
            },
            lastName: {
                maxlength: 'De maximumlengte is 50.'
            },
            title: {
                maxlength: 'De maximumlengte is 20.'
            },
            address: {
                maxlength: 'De maximumlengte is 100.'
            },
            postalCode: {
                maxlength: 'De maximumlengte is 10.'
            },
            city: {
                maxlength: 'De maximumlengte is 100.'
            },
            phoneOne: {
                maxlength: 'De maximumlengte is 100.'
            },
            emailOne: {
                email: 'Vul alstublieft een geldig e-mail adres.',
                maxlength: 'De maximumlengte is 100.'
            }
        }

        this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit() {
        this.personForm = this.fb.group({
            firstName: ['', [Validators.required,
            Validators.maxLength(50)]],
            lastName: ['', [Validators.maxLength(50)]],
            title: ['', [Validators.maxLength(20)]],
            address: ['', [Validators.maxLength(100)]],
            city: ['', [Validators.maxLength(100)]],
            postalCode: ['', [Validators.maxLength(10)]],
            phoneOne: ['', [Validators.maxLength(100)]],
            emailOne: ['', [Validators.email,
            Validators.maxLength(100)]],
        });

        // Read the product Id from the route parameter
        this.sub = this.route.paramMap.subscribe(
            params => {
                const id = +params.get('id');
                this.customerService.getCustomer(id);
            }
        );
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        // This is required because the valueChanges does not provide notification on blur
        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable
        // so we only need to subscribe once.
        merge(this.personForm.valueChanges, ...controlBlurs).pipe(
            debounceTime(500)
        ).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.personForm);
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    //     private getProduct(id: number): void{
    // this.customerService.getCustomer(id)
    //     }
}