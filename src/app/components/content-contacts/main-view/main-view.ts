import { Component, computed, inject, input, signal, output } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { IUser } from '../../../interfaces/iuser';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { TitleCasePipe } from '@angular/common';

@Component({
    imports: [IcContact, TitleCasePipe],
    selector: 'app-main-view',
    styleUrl: './main-view.scss',
    templateUrl: './main-view.html',
})
export class MainView {
    readonly incomingSelectedViewStatus = input<boolean | null>();
    hideMainViewSignal = output<boolean>();
    dbService = inject(Supabase);

    selectedUser = computed(() => {
        return this.dbService.users().find((u) => u.id === this.dbService.selectedUserID()) ?? null;
    });

    hideMainView() {
        this.hideMainViewSignal.emit(true);
    }
}
