import { Component, inject, signal } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TrackableNavigate } from '../../services/trackable-navigate';

@Component({
    imports: [ButtonPrimary],
    selector: 'app-log-in',
    styleUrl: './log-in.scss',
    templateUrl: './log-in.html',
})
export class LogIn {
    navigateService = inject(TrackableNavigate);
    private readonly activeUrl = signal<string>('');

    mode = 'log-in';

    switchToSignUp() {
        this.mode = 'sign-up';
    }

    switchToLogIn() {
        this.mode = 'log-in';
    }
}
