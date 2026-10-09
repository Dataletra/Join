import { Component, computed, inject, output } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { TitleCasePipe } from '@angular/common';
import { IUser } from '../../../interfaces/iuser';
import { ButtonPrimary } from '../../elements/button-primary/button-primary';
import { IcContact } from '../../elements/ic-contact/ic-contact';

@Component({
    imports: [ButtonPrimary, TitleCasePipe, IcContact],
    selector: 'app-namelist',
    styleUrl: './namelist.scss',
    templateUrl: './namelist.html',
})
export class Namelist {
    selectedUserID = output<number>();
    dbService = inject(Supabase);
    userList: IUser[] | null = [];

    ngOnInit() {
        this.fetchUsers();
    }

    async fetchUsers() {
        await this.dbService.getUsers();
        this.userList = this.dbService.users();
        this.sortUsers();
    }

    sortUsers() {
        if (!this.userList) {
            return;
        }
        this.userList.sort((a, b) => a.name.localeCompare(b.name));
    }

    groupedUsers = computed(() => {
        if (!this.dbService.users()) {
            return [];
        }
        const userMap = new Map<string, IUser[]>();
        for (const user of this.dbService.users()) {
            const firstLetter = user.name.charAt(0).toUpperCase();
            if (!userMap.has(firstLetter)) {
                userMap.set(firstLetter, []);
            }
            userMap.get(firstLetter)?.push(user);
        }
        return userMap;
    });

    selectUser(id: number) {
        this.dbService.selectedUserID.set(id);
    }
}
