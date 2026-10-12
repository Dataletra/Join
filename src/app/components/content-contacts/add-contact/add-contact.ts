import { Component, inject, viewChild, ElementRef, effect } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ButtonPrimary } from '../../elements/button-primary/button-primary';
import { FormControl, ReactiveFormsModule, FormGroup, Validator, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';

@Component({
    imports: [IcContact, ButtonPrimary, ReactiveFormsModule],
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

    contactForm = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(3)],
        }),

        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),

        phone: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    onSubmit() {
        console.log('asd');
    }
}
