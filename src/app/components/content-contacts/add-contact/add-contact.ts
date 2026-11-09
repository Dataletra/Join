import { Component, inject, viewChild, ElementRef, effect } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ButtonPrimary } from '../../elements/button-primary/button-primary';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { ContactService } from '../../../services/contact-service';
import { CustomValidators } from '../../../services/custom-validators';

@Component({
    imports: [IcContact, ButtonPrimary, ReactiveFormsModule],
    selector: 'app-add-contact',
    styleUrl: './add-contact.scss',
    templateUrl: './add-contact.html',
})
export class AddContact {
    /** Service for managing contacts and communicating with the Supabase database. */
    supabaseService = inject(ContactService);
    validatorService = inject(CustomValidators);
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('addContact');
    avatarName = '';

    /**
     * Creates an effect that reacts to changes in the dialog service
     * and updates the visibility of the dialog.
     */
    constructor() {
        effect(() => {
            this.openClose();
        });
    }

    /**
     * Opens or closes the contact dialog depending on its current state
     * and the active dialog mode.
     */
    openClose() {
        const isOpen = this.dialogService.isOpen() && this.dialogService.mode() === 'add';
        const dialogRef = this.dialog();
        if (!dialogRef) {
            return;
        }
        const element = dialogRef.nativeElement;
        if (isOpen && !element.open) {
            element.showModal();
        }
        if (!isOpen && element.open) {
            setTimeout(() => {
                element.close();
            }, 300);
        }
    }

    /** Form group containing the contact name, email address and phone number with their validators. */
    contactForm = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, this.validatorService.customNameValidator()],
        }),

        email: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.email,
                this.validatorService.customMailValidator(),
                this.validatorService.customMailDbValidator(),
            ],
        }),

        phone: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, this.validatorService.customPhoneValidator()],
        }),
    });

    /**
     * Validates the contact form and creates a new contact.
     * Resets the form, clears the avatar name and closes the dialog after submission.
     */
    async onSubmit() {
        if (this.contactForm.invalid) {
            return;
        }
        const formData = new User(this.contactForm.value);
        const newUser = await this.supabaseService.addUser(formData, true);
        this.contactForm.reset();
        this.avatarName = '';
        this.dialogService.close();
        this.supabaseService.selectedUserID.set(newUser.id);
    }

    /**
     * Updates the avatar name based on the validity of the name input.
     * Displays the entered name only when it passes validation.
     */
    updateAvatar() {
        const nameControl = this.contactForm.controls.name;
        if (nameControl.valid) {
            this.avatarName = nameControl.value;
        } else {
            this.avatarName = '';
        }
    }
}
