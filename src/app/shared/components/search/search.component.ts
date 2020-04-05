import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChild('searchElement', { static: false }) searchElementRef: ElementRef;
    @Input() helpText: string;
    @Input() hitCount: number;
    @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
    public searchForm: FormGroup;
    public hitMessage: string;
    public userQuestionUpdate = new Subject<string>();

    private _searchTerm: string;
    get searchTerm(): string {
        return this._searchTerm || '';
    }
    @Input() set searchTerm(value: string) {
        if (this._searchTerm != value) {
            this._searchTerm = value;
            if (this.searchForm) {
                this.searchForm.get('userQuestion').setValue(value);
            }
        }
    }

    constructor(private fb: FormBuilder) {
        this.userQuestionUpdate.pipe(
            debounceTime(400),
            distinctUntilChanged())
            .subscribe(value => {
                this.searchTerm = value;
                this.valueChange.emit(value);
            });
    }

    ngOnInit() {
        this.searchForm = this.fb.group({ userQuestion: [this.searchTerm,] });
    }

    ngAfterViewInit(): void {
        if (this.searchElementRef) {
            this.searchElementRef.nativeElement.focus();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['hitCount'] && !changes['hitCount'].currentValue) {
            this.hitMessage = 'Geen gevonden.';
        } else {
            this.hitMessage = this.hitCount + ' gevonden.';
        }
    }

    ngOnDestroy() {
        this.userQuestionUpdate.unsubscribe();
    }

    public onFormSubmit(): void {
        this.searchTerm = this.searchForm.get('userQuestion').value;
        this.valueChange.emit(this.searchTerm);
    }
}
