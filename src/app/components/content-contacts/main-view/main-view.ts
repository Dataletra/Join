import { Component, computed, inject, input, signal, output } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { TitleCasePipe } from '@angular/common';
import { ContactDialog } from '../../../services/contact-dialog';
import { ButtonBack } from '../../elements/button-back/button-back';

@Component({
    imports: [IcContact, TitleCasePipe, ButtonBack],
    selector: 'app-main-view',
    styleUrl: './main-view.scss',
    templateUrl: './main-view.html',
})
export class MainView {
    readonly incomingSelectedViewStatus = input<boolean | null>();
    hideMainViewSignal = output<boolean>();
    showMenu = signal<boolean>(false);
    enableMenuWrapper = signal<boolean>(false);
    dbService = inject(Supabase);
    dialogService = inject(ContactDialog);

    selectedUser = computed(() => {
        return this.dbService.users().find((u) => u.id === this.dbService.selectedUserID()) ?? null;
    });

    hideMainView = () => {
        this.hideMainViewSignal.emit(true);
    };

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

    deleteUser() {
        this.toggleMenu();
        this.dbService.deleteUser(this.dbService.selectedUserID());
    }
}
