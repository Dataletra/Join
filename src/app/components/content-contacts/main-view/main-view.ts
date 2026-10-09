import { Component, computed, effect, inject, input } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { IUser } from '../../../interfaces/iuser';

@Component({
    imports: [],
    selector: 'app-main-view',
    styleUrl: './main-view.scss',
    templateUrl: './main-view.html',
})
export class MainView {
    dbService = inject(Supabase);

    selectedUser = computed(() => {
        return this.dbService.users().find((u) => u.id === this.dbService.selectedUserID()) ?? null;
    });
}
