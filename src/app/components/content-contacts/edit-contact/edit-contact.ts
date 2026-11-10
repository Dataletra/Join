import { Component, inject, viewChild, ElementRef, effect, signal, computed } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ButtonPrimary } from '../../elements/button-primary/button-primary';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { ContactService } from '../../../services/contact-service';
import { PopupConfirm } from '../../elements/popup-confirm/popup-confirm';
import { CustomValidators } from '../../../services/custom-validators';
import { Authentication } from '../../../services/authentication';

@Component({
    imports: [IcContact, ButtonPrimary, ReactiveFormsModule, PopupConfirm],
    selector: 'app-edit-contact',
    styleUrl: './edit-contact.scss',
    templateUrl: './edit-contact.html',
})
export class EditContact {
    supabaseService = inject(ContactService);
    validatorService = inject(CustomValidators);
    dialogService = inject(ContactDialog);
    authService = inject(Authentication);

    dialog = viewChild<ElementRef<HTMLDialogElement>>('editContact');
    avatarName = signal('');
    showConfirm = signal<boolean>(false);

    /**
     * Determines whether the delete action should be disabled.
     * Deletion is disabled if no authentication UID is available
     * for the selected user or if the selected user is the currently logged-in user.
     */
    disableDelete = computed(() => {
        const selected = this.dialogService.selectedUser();
        const current = this.authService.currentUser();
        if (!selected?.uid) {
            return true;
        }
        return selected.uid === current?.uid;
    });

    /**
     * Creates effects for controlling the dialog visibility
     * and loading the selected contact's data into the form.
     */
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
                    phone: user.phone ?? '',
                });
                this.avatarName.set(user.name);
            }
        });
    }

    /**
     * Opens or closes the contact dialog depending on its current state
     * and the active dialog mode.
     */
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
                this.validatorService.customMailDbValidator(() => {
                    return this.dialogService.selectedUser()?.email;
                }),
            ],
        }),

        phone: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, this.validatorService.customPhoneValidator()],
        }),
    });

    /**
     * Validates the form, creates an updated User object
     * and saves the changes to the database.
     * Closes the dialog after a successful update.
     */
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
            uid: selectedUser?.uid,
        });
        await this.supabaseService.editUser(formData, true);
        this.dialogService.close();
    }

    /**
     * Deletes the currently selected contact from the database
     * and closes the dialog.
     */
    async onDelete() {
        const selectedUser = this.dialogService.selectedUser();
        if (!selectedUser) {
            return;
        }
        await this.supabaseService.deleteApiUser(selectedUser.id);
        this.dialogService.close();
    }

    /**
     * Updates the avatar name based on the validity of the name input.
     * Displays the entered name only when it passes validation.
     */
    updateAvatar() {
        const nameControl = this.contactForm.controls.name;
        if (nameControl.valid) {
            this.avatarName.set(nameControl.value);
        } else {
            this.avatarName.set('');
        }
    }
}
