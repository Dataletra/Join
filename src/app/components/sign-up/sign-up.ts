import { afterNextRender, Component, inject, signal } from '@angular/core';
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
    private readonly activeUrl = signal<string>('');
    validatorService = inject(CustomValidators);
    authentication = inject(Authentication);
    mode = 'log-in';
    loginError = signal(false);
    passwordVisible = signal(false);
    signUpPasswordVisible = signal(false);
    confirmPasswordVisible = signal(false);
    static introPlayed: boolean = false;

    switchToSignUp() {
        this.signUpForm.reset();
        this.signUpPasswordVisible.set(false);
        this.confirmPasswordVisible.set(false);
        this.mode = 'sign-up';
    }

    switchToLogIn() {
        this.signUpForm.reset();
        this.signUpPasswordVisible.set(false);
        this.confirmPasswordVisible.set(false);
        this.passwordVisible.set(false);
        this.mode = 'log-in';
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

    logInForm = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    async guestLogIn() {
        const success = await this.authentication.signInAnonymously();
        if (success) {
            this.navigateService.goTo('summary');
        }
    }

    async signUp() {
        if (this.signUpForm.invalid) {
            return;
        }
        const formData = this.signUpForm.getRawValue();
        const success = await this.authentication.signUpNewUser(formData.name, formData.email, formData.password);
        if (success) {
            this.signUpForm.reset();
            this.switchToLogIn();
        }
    }

    async logIn() {
        console.log('login aufgerufen');

        if (this.logInForm.invalid) {
            return;
        }
        const formData = this.logInForm.getRawValue();
        const success = await this.authentication.signInWithEmail(formData.email, formData.password);
        if (success) {
            this.logInForm.reset();
            this.navigateService.goTo('summary');
        } else {
            this.loginError.set(true);
        }
    }
}
