import { Component, signal } from '@angular/core';
import { IcContact } from '../elements/ic-contact/ic-contact';
import { RouterLink } from '@angular/router';

@Component({
    imports: [IcContact, RouterLink],
    selector: 'app-header',
    styleUrl: './header.scss',
    templateUrl: './header.html',
})
export class Header {
    showMenu = signal<boolean>(false);
    enableMenuWrapper = signal<boolean>(false);

    toggleMenu() {
        if (false === this.showMenu()) {
            this.showMenu.set(true);
            this.enableMenuWrapper.set(true);
        } else {
            this.showMenu.set(false);
            setTimeout(() => {
                this.enableMenuWrapper.set(false);
            }, 100);
        }
    }

    hideMenu() {
        this.showMenu.set(false);
        setTimeout(() => {
            this.enableMenuWrapper.set(false);
        }, 100);
    }
}
