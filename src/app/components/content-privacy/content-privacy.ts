import { Component, inject } from '@angular/core';
import { TrackableNavigate } from '../../services/trackable-navigate';

@Component({
    imports: [],
    selector: 'app-content-privacy',
    styleUrl: './content-privacy.scss',
    templateUrl: './content-privacy.html',
})
export class ContentPrivacy {
    private navigateService = inject(TrackableNavigate);

    goBack() {
        this.navigateService.goBack();
    }
}
