import { Component, inject, signal } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../services/custom-validators';
import { Authentication } from '../../services/authentication';
import { ButtonBack } from '../elements/button-back/button-back';

@Component({
    imports: [ButtonPrimary, ReactiveFormsModule, ButtonBack],
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

    /**
     * Reactive sign-up form containing the user's name, email, password,
     * password confirmation and privacy policy acceptance.
     * Uses built-in and custom validators to validate the input.
     */
    signUpForm = new FormGroup(
        {
            name: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    this.validatorService.customNameValidator(),
                    this.validatorService.customFullNameValidator(),
                ],
                updateOn: 'blur',
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

    /**
     * Validates the sign-up form and registers a new user.
     * Resets the form, clears saved data and navigates to the login page
     * if registration was successful.
     */
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

    /**
     * Saves the current form data when leaving the sign-up page,
     * allowing the user to continue where they left off when returning.
     */
    ngOnDestroy() {
        SignUp.savedFormData = this.signUpForm.getRawValue();
    }
}
