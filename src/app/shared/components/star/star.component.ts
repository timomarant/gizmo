import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
    selector: 'app-star',
    templateUrl: './star.component.html'
})
export class StarComponent {
    @Input() isSelected: boolean;
    @Input() modelId: number;
    @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
    private modelIdUpdate = new Subject<any>();

    constructor() {
        this.modelIdUpdate.pipe(
            debounceTime(400))
            .subscribe(() => {
                this.valueChange.emit({modelId: this.modelId, isSelected: this.isSelected});
            });
    }

    toggleSelected(): void {
        this.isSelected = !this.isSelected;
        this.modelIdUpdate.next({modelId: this.modelId, isSelected: this.isSelected});
    }
}
