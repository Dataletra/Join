import { Component } from '@angular/core';
import { IcContact } from '../elements/ic-contact/ic-contact';
import { RouterLink } from '@angular/router';

@Component({
    imports: [IcContact, RouterLink],
    selector: 'app-header',
    styleUrl: './header.scss',
    templateUrl: './header.html',
})
export class Header {
    toggleMenu() {
        const navRef = document.getElementById('user-menu');
        if (navRef?.classList.contains('move-out')) {
            navRef.classList.remove('move-out');
            navRef.classList.add('move-in');
        } else if (navRef) {
            navRef.classList.add('move-out');
            navRef.classList.remove('move-in');
        }
    }

    hideMenu() {
        const navRef = document.getElementById('user-menu');
        if (navRef?.classList.contains('move-in')) {
            navRef.classList.add('move-out');
            navRef.classList.remove('move-in');
        }
    }
}
