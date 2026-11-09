import { Component, inject, signal } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../services/custom-validators';
import { Authentication } from '../../services/authentication';
import { ToastAdded } from '../elements/toast-added/toast-added';

@Component({
    imports: [ButtonPrimary, ReactiveFormsModule, ToastAdded],
    selector: 'app-sign-up',
    styleUrl: './sign-up.scss',
    templateUrl: './sign-up.html',
})
export class SignUp {
    navigateService = inject(TrackableNavigate);
    validatorService = inject(CustomValidators);
    authentication = inject(Authentication);
    signUpPasswordVisible = signal(false);
    confirmPasswordVisible = signal(false);
    static savedFormData: any = null;

    constructor() {
        if (SignUp.savedFormData) {
            this.signUpForm.patchValue(SignUp.savedFormData);
        }
    }

    signUpForm = new FormGroup(
        {
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, this.validatorService.customNameValidator()],
            }),

            email: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.email, this.validatorService.customMailValidator()],
            }),

            password: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, this.validatorService.customPasswordValidator()],
            }),

            confirmPassword: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),

            privacyAccepted: new FormControl(false, {
                nonNullable: true,
                validators: [Validators.requiredTrue],
            }),
        },

        {
            validators: [this.validatorService.customPasswordMatchValidator()],
        }
    );

    async signUp() {
        if (this.signUpForm.invalid) {
            return;
        }
        const formData = this.signUpForm.getRawValue();
        const success = await this.authentication.signUpNewUser(formData.name, formData.email, formData.password);
        if (success) {
            this.signUpForm.reset();
            SignUp.savedFormData = null;
            this.navigateService.goTo('login');
        }
    }

    ngOnDestroy() {
        SignUp.savedFormData = this.signUpForm.getRawValue();
    }
}
