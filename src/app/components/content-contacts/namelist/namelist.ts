import { Component, computed, inject, output, effect } from '@angular/core';
import { ContactService } from '../../../services/contact-service';
import { TitleCasePipe } from '@angular/common';
import { IUser } from '../../../interfaces/iuser';
import { ButtonPrimary } from '../../elements/button-primary/button-primary';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ContactDialog } from '../../../services/contact-dialog';

@Component({
    imports: [ButtonPrimary, TitleCasePipe, IcContact],
    selector: 'app-namelist',
    styleUrl: './namelist.scss',
    templateUrl: './namelist.html',
})
export class Namelist {
    isUserSelected = output<boolean>();
    dbService = inject(ContactService);
    userList: IUser[] | null = [];
    dialogService = inject(ContactDialog);

    constructor() {
        effect(() => {
            const selectedUserID = this.dbService.selectedUserID();
            const users = this.dbService.users();
            if (selectedUserID === null) return;
            const checkUser = users.some((user) => user.id === selectedUserID);
            if (!checkUser) return;
            queueMicrotask(() => {
                this.scrollToSelectedUser();
            });
        });
    }

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
        this.dbService.selectedUserID.set(null);
        (setTimeout(() => {
            this.dbService.selectedUserID.set(id);
            this.isUserSelected.emit(true);
        }),
            100);
    }

    scrollToSelectedUser() {
        const selectedUserID = this.dbService.selectedUserID();
        if (selectedUserID === null) {
            return;
        }
        document.getElementById(`user-${selectedUserID}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }
}
