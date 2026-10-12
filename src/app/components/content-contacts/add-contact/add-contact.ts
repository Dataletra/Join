import { Component, inject, viewChild, ElementRef, effect } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ButtonPrimary } from '../../elements/button-primary/button-primary';

@Component({
    imports: [IcContact, ButtonPrimary],
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
