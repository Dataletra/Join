import { Component } from '@angular/core';
import { IcContact } from '../elements/ic-contact/ic-contact';

@Component({
    imports: [IcContact],
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
}
