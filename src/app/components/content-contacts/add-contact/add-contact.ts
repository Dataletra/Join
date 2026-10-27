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
import { CustomValidators } from '../../../services/custom-validators';

@Component({
    imports: [IcContact, ButtonPrimary, ReactiveFormsModule],
    selector: 'app-add-contact',
    styleUrl: './add-contact.scss',
    templateUrl: './add-contact.html',
})
export class AddContact {
    supabaseService = inject(ContactService);
    validatorService = inject(CustomValidators);
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
            setTimeout(() => {
                element.close();
            }, 300);
        }
    }

    contactForm = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, this.validatorService.customNameValidator()],
        }),

        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email, this.validatorService.customMailValidator()],
        }),

        phone: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, this.validatorService.customPhoneValidator()],
        }),
    });



    async onSubmit() {
        if (this.contactForm.invalid) {
            return;
        }
        const formData = new User(this.contactForm.value);
        const newUser = await this.supabaseService.addUser(formData);
        this.contactForm.reset();
        this.avatarName = '';
        this.dialogService.close();
        this.supabaseService.selectedUserID.set(newUser.id);
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
