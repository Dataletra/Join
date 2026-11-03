import { Service, signal } from '@angular/core';

@Service()
export class AppStateService {
    isLoggedIn = signal<boolean>(false);
    displayLogIn = signal<boolean>(false);

    loggingIn() {
        this.isLoggedIn.set(true);
    }

    hideLogIn() {
        this.displayLogIn.set(true);
    }

    showLogIn() {
        this.displayLogIn.set(false);
    }
}
