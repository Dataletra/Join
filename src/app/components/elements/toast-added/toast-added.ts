import { Component, inject } from '@angular/core';
import { Toast } from '../../../services/toast';

@Component({
    imports: [],
    selector: 'app-toast-added',
    styleUrl: './toast-added.scss',
    templateUrl: './toast-added.html',
})
export class ToastAdded {
    toastService = inject(Toast);
}
