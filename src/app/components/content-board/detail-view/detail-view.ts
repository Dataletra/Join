import { Component, inject } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';

@Component({
    imports: [],
    selector: 'app-detail-view',
    styleUrl: './detail-view.scss',
    templateUrl: './detail-view.html',
})
export class DetailView {
    dialogService = inject(ContactDialog);
}
