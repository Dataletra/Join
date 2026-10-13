import { Component, inject } from '@angular/core';
import { TrackableNavigate } from '../../services/trackable-navigate';

@Component({
    imports: [],
    selector: 'app-content-legal',
    styleUrl: './content-legal.scss',
    templateUrl: './content-legal.html',
})
export class ContentLegal {
    private navigateService = inject(TrackableNavigate);

    goBack() {
        this.navigateService.goBack();
    }
}
