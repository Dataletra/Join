import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from '../../services/authentication';
import { ToastAdded } from '../elements/toast-added/toast-added';

@Component({
    imports: [ButtonPrimary, ReactiveFormsModule, ToastAdded],
    selector: 'app-log-in',
    styleUrl: './log-in.scss',
    templateUrl: './log-in.html',
})
export class LogIn {
    navigateService = inject(TrackableNavigate);
    authentication = inject(Authentication);
    loginError = signal(false);
    passwordVisible = signal(false);
    static introPlayed: boolean = false;
    introPlayed = LogIn.introPlayed;
    static savedFormData: any = null;

    /**
     * Restores previously saved form data when the component is initialized.
     * Marks the intro animation as played after the initial render.
     */
    constructor() {
        if (LogIn.savedFormData) {
            this.logInForm.patchValue(LogIn.savedFormData);
        }

        afterNextRender(() => {
            LogIn.introPlayed = true;
        });
    }

    /**
     * Reactive login form containing email and password fields.
     * Both fields are required, and the email field must contain a valid email address.
     */
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

    /**
     * Signs in a user anonymously as a guest.
     * Navigates to the summary page if authentication is successful.
     */
    async guestLogIn() {
        const success = await this.authentication.signInAnonymously();
        if (success) {
            this.navigateService.goTo('summary');
        }
    }

    /**
     * Validates the login form and attempts to authenticate the user
     * with the provided email address and password.
     * Navigates to the summary page on success or displays an error on failure.
     */
    async logIn() {
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

    /**
     * Saves the current form data when leaving the login page,
     * allowing the user to continue where they left off when returning.
     */
    ngOnDestroy() {
        LogIn.savedFormData = this.logInForm.getRawValue();
    }
}
