import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { merge } from 'rxjs/internal/observable/merge';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { map } from 'rxjs/internal/operators/map';
import { GenericValidator } from '../../../shared/models/generic-validator';
import { CustomerForEdit } from '../models/customer-for-edit';
import { CustomerService, CountryService, MunicipalityService, ToastService } from '../../../core/services';

@Component({
    selector: 'app-customer-edit',
    templateUrl: './customer-edit.component.html'
})
export class CustomerEditComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    private sub: Subscription;
    private genericValidator: GenericValidator;
    private validationMessages: { [key: string]: { [key: string]: string } };

    public customerForm: FormGroup;
    public customerForEdit: CustomerForEdit;
    public displayMessage: { [key: string]: string } = {};
    public primaryLabelOnMap: string;
    public secondaryLabelOnMap: string;
    public title: string;
    public titleOnMap: string;
    public countryList: { name: string, code: string }[];
    public municipalityList: { displayName: string, postalCode: string, latitude: number, longitude: number }[];
    public latitude: number = 51.074760;
    public longitude: number = 4.791020;

    public model: { displayName: string, postalCode: string };

    public postcodesAsArray = new Array();

    get phoneNumbersFormArray(): FormArray {
        return <FormArray>this.customerForm.get('phoneNumbers');
    }

    get emailAddressesFormArray(): FormArray {
        return <FormArray>this.customerForm.get('emailAddresses');
    }

    gemeentes = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 2
                ? []
                : this.municipalityList
                    .filter(v => v.displayName.toLowerCase().startsWith(term.toLowerCase()))
                    .slice(0, 10)
                    .map(item => item.displayName))
        )

    postcodes = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1
                ? []
                : this.municipalityList
                    .filter(v => v.postalCode.startsWith(term))
                    .slice(0, 10)
                    .map(item => item.postalCode))
        )

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomerService,
        private countryService: CountryService,
        private municipalityService: MunicipalityService,
        private toastService: ToastService
    ) {
        this.validationMessages = {
            name: {
                required: 'Vul alstublieft een naam in.',
                pattern: 'Naam bevat ongeldige tekens.',
                maxlength: 'De maximumlengte is 50.'
            },
            vatNumber: {
                pattern: 'Ondernemingsnummer bevat ongeldige tekens.',
                maxlength: 'De maximumlengte is 15.'
            },
            address: {
                maxlength: 'De maximumlengte is 100.',
                pattern: 'Adres bevat ongeldige tekens.',
            },
            postalCode: {
                maxlength: 'De maximumlengte is 10.',
                pattern: 'Postcode bevat ongeldige tekens.',
            },
            city: {
                maxlength: 'De maximumlengte is 50.',
                pattern: 'Gemeente bevat ongeldige tekens.',
            },
            phone: {
                maxlength: 'De maximumlengte is 15.',
                pattern: 'Telefoon bevat ongeldige tekens.'
            },
            email: {
                email: 'Vul alstublieft een geldig e-mail adres in.',
                maxlength: 'De maximumlengte is 100.'
            }
        }

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.customerForEdit = new CustomerForEdit();
    }

    ngOnInit() {
        this.countryList = this.countryService.getCountries();
        this.municipalityList = this.municipalityService.getMunicipalities('be');

        let validCharsRegExp = new RegExp('^[a-zA-Z0-9\\s\\(\\).,/-]+$');
        this.customerForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(validCharsRegExp)]],
            vatNumber: [null, [Validators.maxLength(15), Validators.pattern(validCharsRegExp)]],
            address: [null, [Validators.maxLength(100), Validators.pattern(validCharsRegExp)]],
            city: [null, [Validators.maxLength(50), Validators.pattern(validCharsRegExp)]],
            postalCode: [null, [Validators.maxLength(10), Validators.pattern(validCharsRegExp)]],
            phoneNumbers: this.fb.array([this.buildPhoneNumbersGroup(null)]),
            emailAddresses: this.fb.array([this.buildEmailAdrressesGroup(null)])
        });

        // Read the customer Id from the route parameter
        this.sub = this.route.paramMap.subscribe(
            params => {
                const id = +params.get('id');
                if (id > 0) {
                    this.title = 'Bewerk klant';
                    this.getCustomer(id);
                }
                else {
                    this.title = 'Nieuwe klant';
                }
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
            debounceTime(300)
        ).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.customerForm);
        });

        //this.customerForm.valueChanges.subscribe(value => {
        // this.primaryLabelOnMap = '';
        // this.secondaryLabelOnMap = '';
        // if (this.customerForm.get('name').value) {
        //     this.primaryLabelOnMap = this.customerForm.get('name').value.substring(0, 20);
        // }
        // var phoneArray = this.customerForm.get('phoneNumbers') as FormArray;
        // var phoneGroup = phoneArray.at(0);
        // if (phoneGroup.get('phoneOne').value) {
        //     this.secondaryLabelOnMap = phoneGroup.get('phoneOne').value.substring(0, 20);
        // }
        //});
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public onMunicipalitySelected($event: any): void {
        var displayName = $event.item;
        var selectedMunicipality = this.municipalityList.find(item => item.displayName == displayName);

        this.customerForm.controls['postalCode'].setValue(selectedMunicipality.postalCode);

        // if (this.customerForEdit.postalCode !== selectedMunicipality.postalCode)
        //     this.customerForEdit.control();

        this.latitude = selectedMunicipality.latitude;
        this.longitude = selectedMunicipality.longitude;
        console.log('-- lat ' + selectedMunicipality.latitude);
        console.log('-- lng ' + selectedMunicipality.longitude);
    }

    public saveCustomer(): void {
        console.log(this.customerForm);
        if (this.customerForm.valid) {
            if (this.customerForm.dirty) {
                const c = this.mapFormToCustomer();
                if (!c.id) {
                    this.customerService.createCustomer(c).subscribe({ next: () => this.onSaveComplete() });
                } else {
                    this.customerService.updateCustomer(c).subscribe({ next: () => this.onSaveComplete() });
                }
            }
        } else {
            this.toastService.show('Controleer of alle verplichte velden ingevuld zijn.');
        }
    }

    public addPhoneNumber(): void {
        if (this.phoneNumbersFormArray.length === 3) return;
        this.phoneNumbersFormArray.push(this.buildPhoneNumbersGroup(null));
    }

    public deletePhoneNumber(): void {
        if (this.phoneNumbersFormArray.length === 1) return;
        this.phoneNumbersFormArray.removeAt(this.phoneNumbersFormArray.length - 1);
        this.phoneNumbersFormArray.markAsDirty();
    }

    public addEmailAddress(): void {
        if (this.emailAddressesFormArray.length === 3) return;
        this.emailAddressesFormArray.push(this.buildEmailAdrressesGroup(null));
    }

    public deleteEmailAddress(): void {
        if (this.emailAddressesFormArray.length === 1) return;
        this.emailAddressesFormArray.removeAt(this.emailAddressesFormArray.length - 1);
        this.emailAddressesFormArray.markAsDirty();
    }

    private buildPhoneNumbersGroup(value: string): FormGroup {
        let phoneNumberRegExp = new RegExp("^[0-9\\'\\s\\(\\).-]+$");
        return this.fb.group({ phone: [this.getValueOrNull(value), [Validators.maxLength(20), Validators.pattern(phoneNumberRegExp)]] });
    }

    private buildEmailAdrressesGroup(value: string): FormGroup {
        return this.fb.group({ email: [this.getValueOrNull(value), [Validators.email, Validators.maxLength(100)]] });
    }

    private DisplayCustomer(customerForEdit: CustomerForEdit): void {
        if (this.customerForm) {
            this.customerForm.reset();
        }
        this.PatchForm(customerForEdit);
    }

    private PatchForm(customerForEdit: CustomerForEdit) {

        this.customerForEdit = customerForEdit;

        this.customerForm.patchValue({
            name: customerForEdit.name,
            vatNumber: customerForEdit.vatNumber,
            address: customerForEdit.address,
            postalCode: customerForEdit.postalCode,
            city: customerForEdit.city
        });

        if (this.customerForEdit.phoneOne) {
            this.phoneNumbersFormArray.clear();
            this.phoneNumbersFormArray.push(this.buildPhoneNumbersGroup(this.customerForEdit.phoneOne));
        }
        if (this.customerForEdit.phoneTwo || this.customerForEdit.phoneThree) {
            this.phoneNumbersFormArray.push(this.buildPhoneNumbersGroup(this.customerForEdit.phoneTwo));
        }
        if (this.customerForEdit.phoneThree) {
            this.phoneNumbersFormArray.push(this.buildPhoneNumbersGroup(this.customerForEdit.phoneThree));
        }
        if (this.customerForEdit.emailOne) {
            this.emailAddressesFormArray.clear();
            this.emailAddressesFormArray.push(this.buildEmailAdrressesGroup(this.customerForEdit.emailOne));
        }
        if (this.customerForEdit.emailTwo || this.customerForEdit.emailThree) {
            this.emailAddressesFormArray.push(this.buildEmailAdrressesGroup(this.customerForEdit.emailTwo));
        }
        if (this.customerForEdit.emailThree) {
            this.emailAddressesFormArray.push(this.buildEmailAdrressesGroup(this.customerForEdit.emailThree));
        }
    }

    private getCustomer(id: number): void {
        this.customerService.getCustomer(id).subscribe({
            next: (customerForEdit: CustomerForEdit) => {
                this.title = customerForEdit.name;
                if (customerForEdit.phoneOne) {
                    this.primaryLabelOnMap = customerForEdit.phoneOne;
                }
                if (customerForEdit.emailOne) {
                    this.secondaryLabelOnMap = customerForEdit.emailOne;
                }
                this.DisplayCustomer(customerForEdit)
            }
        });
    }

    private onSaveComplete(): void {      
        this.toastService.show('Klant is successvol bewaard.');
        this.customerForm.markAsPristine();
        this.customerForm.markAsUntouched();
    }

    private mapFormToCustomer(): CustomerForEdit {
        const c = { ...this.customerForEdit, ...this.customerForm.value }

        c.countryTwoLetterCode = 'BE';
        c.phoneOne = null;
        c.phoneTwo = null;
        c.phoneThree = null;
        c.emailOne = null;
        c.emailTwo = null;
        c.emailThree = null;

        c.address = this.getValueOrNull(this.customerForm.get('address').value)

        if (this.phoneNumbersFormArray.at(0)) {
            c.phoneOne = this.getValueOrNull(this.phoneNumbersFormArray.at(0).get('phone').value);
        }
        if (this.phoneNumbersFormArray.at(1)) {
            c.phoneTwo = this.getValueOrNull(this.phoneNumbersFormArray.at(1).get('phone').value);
        }
        if (this.phoneNumbersFormArray.at(2)) {
            c.phoneThree = this.getValueOrNull(this.phoneNumbersFormArray.at(2).get('phone').value);
        }

        if (this.emailAddressesFormArray.at(0)) {
            c.emailOne = this.getValueOrNull(this.emailAddressesFormArray.at(0).get('email').value);
        }
        if (this.emailAddressesFormArray.at(1)) {
            c.emailTwo = this.getValueOrNull(this.emailAddressesFormArray.at(1).get('email').value);
        }
        if (this.emailAddressesFormArray.at(2)) {
            c.emailThree = this.getValueOrNull(this.emailAddressesFormArray.at(2).get('email').value);
        }

        return c;
    }

    private getValueOrNull(value: any): any {
        if (value)
            return value;
        else
            return null;
    }
}
