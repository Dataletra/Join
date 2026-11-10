import { Component, computed, inject, input, signal, output } from '@angular/core';
import { ContactService } from '../../../services/contact-service';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { TitleCasePipe } from '@angular/common';
import { ContactDialog } from '../../../services/contact-dialog';
import { ButtonBack } from '../../elements/button-back/button-back';
import { PopupConfirm } from '../../elements/popup-confirm/popup-confirm';
import { Menu, MenuItem } from '@angular/aria/menu';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Authentication } from '../../../services/authentication';

@Component({
    imports: [
        IcContact,
        TitleCasePipe,
        ButtonBack,
        PopupConfirm,
        Menu,
        MenuItem,
        CdkConnectedOverlay,
        CdkOverlayOrigin,
    ],
    selector: 'app-main-view',
    styleUrl: './main-view.scss',
    templateUrl: './main-view.html',
})
export class MainView {
    authService = inject(Authentication);
    readonly incomingSelectedViewStatus = input<boolean | null>();
    hideMainViewSignal = output<boolean>();
    showMenu = signal<boolean>(false);
    enableMenuWrapper = signal<boolean>(false);
    dbService = inject(ContactService);
    dialogService = inject(ContactDialog);
    showConfirm = signal<boolean>(false);
    overlayListen = signal<boolean>(false);

    /**
     * Returns the currently selected user.
     * Searches the contact list using the selected user ID.
     * Returns null if no matching user is found.
     */
    selectedUser = computed(() => {
        return this.dbService.users().find((u) => u.id === this.dbService.selectedUserID()) ?? null;
    });

    /**
     * Emits an event to hide the main user view.
     */
    hideMainView = () => {
        this.hideMainViewSignal.emit(true);
    };

    /**
     * Toggles the visibility of the context menu.
     * Enables the overlay when opening and disables it after a short delay when closing.
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
     * Closes the context menu if it is currently open.
     * Disables the overlay after a short delay.
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
     * Deletes the currently selected user from the application database
     * and removes the corresponding authentication user.
     */
    deleteUser() {
        this.dbService.deleteApiUser(this.dbService.selectedUserID());
        this.dbService.deleteAuthUser(this.dbService.selectedUserID());
        this.authService.signOut();
    }

    /**
     * Determines whether the delete action should be disabled.
     * Deletion is disabled if no authentication UID is available
     * for the selected user or if the selected user is the currently logged-in user.
     */
    disableDelete = computed(() => {
        const selected = this.selectedUser();
        const current = this.authService.currentUser();
        if (!selected?.uid) {
            return true;
        }
        return selected.uid === current?.uid;
    });
}
