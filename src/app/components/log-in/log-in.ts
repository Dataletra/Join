import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../services/custom-validators';
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

    constructor() {
        if (LogIn.savedFormData) {
            this.logInForm.patchValue(LogIn.savedFormData);
        }

        afterNextRender(() => {
            LogIn.introPlayed = true;
        });
    }

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

    ngOnDestroy() {
        LogIn.savedFormData = this.logInForm.getRawValue();
    }
}
