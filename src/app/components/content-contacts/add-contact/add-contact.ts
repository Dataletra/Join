import { Component, inject, viewChild, ElementRef, effect } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ButtonPrimary } from '../../elements/button-primary/button-primary';
import {
    FormControl,
    ReactiveFormsModule,
    FormGroup,
    Validators,
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { User } from '../../models/user';
import { ContactService } from '../../../services/contact-service';
import { Toast } from '../../../services/toast';

@Component({
    imports: [IcContact, ButtonPrimary, ReactiveFormsModule],
    selector: 'app-add-contact',
    styleUrl: './add-contact.scss',
    templateUrl: './add-contact.html',
})
export class AddContact {
    supabaseService = inject(ContactService);
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('addContact');
    avatarName = '';

    constructor() {
        effect(() => {
            this.openClose();
        });
    }

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
            element.close();
        }
    }

    contactForm = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, this.customNameValidator()],
        }),

        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email, this.customMailValidator()],
        }),

        phone: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, this.customPhoneValidator()],
        }),
    });

    customNameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }
            const pattern = /^[\p{L},'-]{2,}(?:[ ][\p{L},'-]{2,})+$/u;
            return pattern.test(value) ? null : { namePattern: true };
        };
    }

    customMailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }
            const pattern = /^[^\s@]{2,}@[^\s@]{2,}\.[^\s@]{2,}$/;
            return pattern.test(value) ? null : { emailPattern: true };
        };
    }

    customPhoneValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }
            const pattern = /^\+?[0-9\s()/-]+$/;
            const digitCount = value.replace(/\D/g, '').length;
            if (!pattern.test(value) || digitCount < 6) {
                return { phonePattern: true };
            }
            return null;
        };
    }

    async onSubmit() {
        if (this.contactForm.invalid) {
            return;
        }
        const formData = new User(this.contactForm.value);
        await this.supabaseService.addUser(formData);
        this.dialogService.close();
    }

    updateAvatar() {
        const nameControl = this.contactForm.controls.name;
        if (nameControl.valid) {
            this.avatarName = nameControl.value;
        } else {
            this.avatarName = '';
        }
    }
}
