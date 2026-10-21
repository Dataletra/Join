import { Component, inject, signal } from '@angular/core';
import { IcContact } from '../elements/ic-contact/ic-contact';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { Menu, MenuItem } from '@angular/aria/menu';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

@Component({
    imports: [IcContact, Menu, MenuItem, CdkConnectedOverlay, CdkOverlayOrigin],
    selector: 'app-header',
    styleUrl: './header.scss',
    templateUrl: './header.html',
})
export class Header {
    showMenu = signal<boolean>(false);
    overlayListen = signal<boolean>(false);
    navigateService = inject(TrackableNavigate);

    toggleMenu() {
        if (false === this.showMenu()) {
            this.overlayListen.set(true);
            this.showMenu.set(true);
        } else {
            this.showMenu.set(false);
            setTimeout(() => {
                this.overlayListen.set(false);
            }, 100);
        }
    }

    hideMenu() {
        if (this.showMenu()) {
            this.showMenu.set(false);

            setTimeout(() => {
                this.overlayListen.set(false);
            }, 100);
        }
    }

    goToPage(path: string) {
        this.hideMenu();
        this.navigateService.goTo(path);
    }
}
