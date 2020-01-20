import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GenericValidator } from '../../../shared/generic-validator';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../customer.service';
import { CustomerForEdit } from '../customer-for-edit';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { merge } from 'rxjs/internal/observable/merge';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
    selector: 'app-customer-edit',
    templateUrl: './customer-edit.component.html',
    styles: [`
    agm-map {
      height: 400px;
    }
  `]
})
export class CustomerEditComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public customerForm: FormGroup;
    public customerForEdit = new CustomerForEdit();

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    public displayMessage: { [key: string]: string } = {};

    public errorMessage: string;

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
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.maxLength(50)]],
            title: ['', [Validators.maxLength(20)]],
            address: ['', [Validators.maxLength(100)]],
            city: ['', [Validators.maxLength(100)]],
            postalCode: ['', [Validators.maxLength(10)]],
            phoneOne: ['', [Validators.maxLength(100)]],
            emailOne: ['', [Validators.email, Validators.maxLength(100)]],
        });

        // Read the product Id from the route parameter
        this.sub = this.route.paramMap.subscribe(
            params => {
                const id = +params.get('id');
                this.getCustomer(id);
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
        merge(this.customerForm.valueChanges, ...controlBlurs).pipe(
            debounceTime(500)
        ).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.customerForm);
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private DisplayCustomer(customerForEdit: CustomerForEdit): void {
        if (this.customerForm) {
            this.customerForm.reset();
        }

        this.customerForEdit = customerForEdit;

        if (this.customerForEdit.id === 0) {

        } else {

        }

        this.customerForm.patchValue({
            firstName: this.customerForEdit.personFirstName,
            lastName: this.customerForEdit.personLastName,
            title: this.customerForEdit.personTitle,
            address: this.customerForEdit.address,
            postalCode: this.customerForEdit.postalCode,
            city: this.customerForEdit.city,
            emailOne: this.customerForEdit.emailOne,
        });
    }

    private getCustomer(id: number): void {
        this.customerService.getCustomer(id).subscribe({
            next: (customerForEdit: CustomerForEdit) => this.DisplayCustomer(customerForEdit),
            error: err => this.errorMessage = err
        });
    }
}
