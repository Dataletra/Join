import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { IcContact } from '../elements/ic-contact/ic-contact';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { Menu, MenuItem, MenuContent, MenuTrigger } from '@angular/aria/menu';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Authentication } from '../../services/authentication';
import { ContentSummary } from '../content-summary/content-summary';

@Component({
    imports: [IcContact, Menu, MenuItem, MenuContent, CdkConnectedOverlay, CdkOverlayOrigin, MenuTrigger],
    selector: 'app-header',
    styleUrl: './header.scss',
    templateUrl: './header.html',
    providers: [ContentSummary]
})
export class Header {
    showMenu = signal<boolean>(false);
    overlayListen = signal<boolean>(false);
    navigateService = inject(TrackableNavigate);
    authService = inject(Authentication);
    summary = inject(ContentSummary);

    headerMenu = viewChild<Menu<string>>('headerMenu');
    userName = computed<string>(() => {
        const currentName = this.authService.currentUser()?.name ?? 'Guest';
        return this.authService.isSignedIn() ? currentName : 'XX';
    });

    /**
     * Show or hide the dropdown menu from user icon.
     */
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

    /**
     * Hide dropdown menu.
     */
    hideMenu() {
        if (this.showMenu()) {
            this.showMenu.set(false);

            setTimeout(() => {
                this.overlayListen.set(false);
            }, 100);
        }
    }

    /**
     * Hide menu and go to given path by navigation service.
     * @param path {string} - path to go to
     */
    goToPage(path: string) {
        this.hideMenu();
        this.navigateService.goTo(path);
    }
}
