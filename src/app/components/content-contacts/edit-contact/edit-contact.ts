import { Component, inject, viewChild, ElementRef, effect, signal } from '@angular/core';
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
import { PopupConfirm } from '../../elements/popup-confirm/popup-confirm';

@Component({
    imports: [IcContact, ButtonPrimary, ReactiveFormsModule, PopupConfirm],
    selector: 'app-edit-contact',
    styleUrl: './edit-contact.scss',
    templateUrl: './edit-contact.html',
})
export class EditContact {
    supabaseService = inject(ContactService);
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('editContact');
    avatarName = '';
    showConfirm = signal<boolean>(false);

    constructor() {
        effect(() => {
            this.openClose();
        });

        effect(() => {
            const editMode = this.dialogService.isOpen() && this.dialogService.mode() === 'edit';
            const user = this.dialogService.selectedUser();
            if (editMode && user) {
                const name = user.name.toLowerCase().replace(/\b\p{L}/gu, (char) => char.toUpperCase());
                this.contactForm.setValue({
                    name: name,
                    email: user.email,
                    phone: user.phone,
                });
                this.avatarName = user.name;
            }
        });
    }

    openClose() {
        const isOpen = this.dialogService.isOpen() && this.dialogService.mode() === 'edit';
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
            const pattern = /^[\p{L}]{2,}(?:[ '-][\p{L}]{2,})+$/u;
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
        const selectedUser = this.dialogService.selectedUser();
        const formData = new User({
            id: selectedUser?.id,
            created_at: selectedUser?.created_at,
            name: this.contactForm.controls.name.value,
            email: this.contactForm.controls.email.value,
            phone: this.contactForm.controls.phone.value,
            password: selectedUser?.password,
        });
        await this.supabaseService.editUser(formData);
        this.dialogService.close();
    }

    async onDelete() {
        const selectedUser = this.dialogService.selectedUser();
        if (!selectedUser) {
            return;
        }
        await this.supabaseService.deleteUser(selectedUser.id);
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
