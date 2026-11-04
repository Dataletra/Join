import { Component, inject, signal } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../services/custom-validators';
import { Authentication } from '../../services/authentication';

@Component({
    imports: [ButtonPrimary, ReactiveFormsModule],
    selector: 'app-log-in',
    styleUrl: './log-in.scss',
    templateUrl: './log-in.html',
})
export class LogIn {
    navigateService = inject(TrackableNavigate);
    private readonly activeUrl = signal<string>('');
    validatorService = inject(CustomValidators);
    authentication = inject(Authentication);

    mode = 'log-in';
    dNone = signal(false);

    switchToSignUp() {
        this.signUpForm.reset();
        this.mode = 'sign-up';
    }

    switchToLogIn() {
        this.signUpForm.reset();
        this.mode = 'log-in';
    }

    hideLogIn() {
        this.dNone.set(true);
    }

    showLogIn() {
        this.dNone.set(false);
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
        },

        {
            validators: [this.validatorService.customPasswordMatchValidator()],
        }
    );

    async guestLogIn() {
        const success = await this.authentication.signInAnonymously();

        if (success) {
            this.navigateService.goTo('summary');
        }
    }
}
