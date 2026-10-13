import { Component, inject } from '@angular/core';
import { TrackableNavigate } from '../../services/trackable-navigate';

@Component({
    imports: [],
    selector: 'app-content-help',
    styleUrl: './content-help.scss',
    templateUrl: './content-help.html',
})
export class ContentHelp {
    private navigateService = inject(TrackableNavigate);

    goBack() {
        this.navigateService.goBack();
    }
}
