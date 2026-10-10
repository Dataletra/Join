import { Component, inject, viewChild, ElementRef, effect } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';

@Component({
    imports: [],
    selector: 'app-add-contact',
    styleUrl: './add-contact.scss',
    templateUrl: './add-contact.html',
})
export class AddContact {
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('addContact');

    constructor() {
        effect(() => {
            this.openClose();
        });
    }

    openClose() {
        const isOpen = this.dialogService.isOpen();
        const dialogRef = this.dialog();
        if (!dialogRef) {
            return;
        }
        const element = dialogRef.nativeElement;
        if (isOpen && !element.open) {
            element.showModal();
        }
        if (!isOpen && element.open) {
            element.close();
        }
    }
}
