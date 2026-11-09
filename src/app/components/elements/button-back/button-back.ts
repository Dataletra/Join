import { Component, inject, input } from '@angular/core';
import { TrackableNavigate } from '../../../services/trackable-navigate';

@Component({
    imports: [],
    selector: 'app-button-back',
    styleUrl: './button-back.scss',
    templateUrl: './button-back.html',
})
export class ButtonBack {
    private navigateService = inject(TrackableNavigate);
    
    /**
     * Navigate back by trackable router navigation.
     */
    goBack = () => {
        this.navigateService.goBack();
    };
    
    callback = input<() => void>(this.goBack);
}
