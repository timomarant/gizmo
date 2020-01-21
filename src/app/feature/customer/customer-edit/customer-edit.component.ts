import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { merge } from 'rxjs/internal/observable/merge';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { GenericValidator } from '../../../shared/generic-validator';
import { CustomerService } from '../customer.service';
import { CustomerForEdit } from '../customer-for-edit';

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

    private sub: Subscription;
    private genericValidator: GenericValidator;
    private validationMessages: { [key: string]: { [key: string]: string } };

    public customerForm: FormGroup;
    public customerForEdit = new CustomerForEdit();
    public displayMessage: { [key: string]: string } = {};
    public primaryLabelOnMap: string;
    public secondaryLabelOnMap: string;
    public titleOnMap: string;
    public errorMessage: string;

    get phoneNumbers(): FormArray {
        return <FormArray>this.customerForm.get('phoneNumbers');
    }

    get emailAddresses(): FormArray {
        return <FormArray>this.customerForm.get('emailAddresses');
    }

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
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
                required: 'Vul alstublieft uw telefoon in.',
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
            // customerType: ['', [Validators.required]],
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.maxLength(50)]],
            title: ['', [Validators.maxLength(20)]],
            address: ['', [Validators.maxLength(100)]],
            city: ['', [Validators.maxLength(100)]],
            postalCode: ['', [Validators.maxLength(10)]],
            phoneNumbers: this.fb.array([this.builPhoneNumbers()]),
            emailAddresses: this.fb.array([this.buildEmailAdrresses()])
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

        this.customerForm.valueChanges.subscribe(value => {
            this.primaryLabelOnMap = '';
            this.secondaryLabelOnMap = '';
            if (this.customerForm.get('firstName').value)
                this.primaryLabelOnMap = this.customerForm.get('firstName').value.substring(0, 20);
            if (this.customerForm.get('title').value)
                this.secondaryLabelOnMap = this.customerForm.get('title').value.substring(0, 20);
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public addPhoneNumber(): void {
        if (this.phoneNumbers.length === 3) return;
        this.phoneNumbers.push(this.builPhoneNumbers());
    }

    public addEmailAddress(): void {
        if (this.emailAddresses.length === 3) return;
        this.emailAddresses.push(this.buildEmailAdrresses());
    }

    public removeEmailAddress(): void {
        //this.emailAddresses.pop();
    }

    private builPhoneNumbers(): FormGroup {
        return this.fb.group({
            phoneOne: ['', [Validators.maxLength(10)]]
        });
    }

    private buildEmailAdrresses(): FormGroup {
        return this.fb.group({
            emailOne: ['', [Validators.email, Validators.maxLength(100)]]
        });
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

    private saveCustomer(): void {
        if (this.customerForm.valid) {
            if (this.customerForm.dirty) {
                const c = { ...this.customerForEdit, ...this.customerForm.value }

                if (c === 0) {

                } else {
                    this.customerService.updateProduct(c)
                        .subscribe({
                            next: () => this.onSaveComplete(),
                            error: err => this.errorMessage = err
                        });
                }
            } else {
                this.onSaveComplete()
            }

        } else {
            this.errorMessage = 'Please correct the validation errors.'
        }
    }

    private onSaveComplete(): void{
        this.customerForm.reset();
        this.router.navigate(['/customers']);
    }
}
