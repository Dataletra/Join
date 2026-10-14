import { Component, inject, signal } from '@angular/core';
import { IcContact } from '../elements/ic-contact/ic-contact';
import { TrackableNavigate } from '../../services/trackable-navigate';

@Component({
    imports: [IcContact],
    selector: 'app-header',
    styleUrl: './header.scss',
    templateUrl: './header.html',
})
export class Header {
    showMenu = signal<boolean>(false);
    enableMenuWrapper = signal<boolean>(false);
    navigateService = inject(TrackableNavigate);

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

    goToPage(path: string) {
        this.hideMenu();
        this.navigateService.goTo(path);
    }
}
