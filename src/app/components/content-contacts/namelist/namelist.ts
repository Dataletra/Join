import { Component, computed, inject, output, effect, signal } from '@angular/core';
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
    isFetchPending = signal<boolean>(true);

    /**
     * Observes changes to the selected user and the user list.
     * Scrolls the selected user into view once the user exists in the list.
     */
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

    /**
     * Fetches the user data when the component is initialized.
     */
    ngOnInit() {
        this.fetchUsers();
    }

    /**
     * Retrieves users from the contact service.
     * Updates the local user list, sorts it alphabetically
     * and marks the loading process as complete.
     */
    async fetchUsers() {
        await this.dbService.getUsers();
        this.userList = this.dbService.users();
        this.sortUsers();
        this.isFetchPending.set(false);
    }

    /**
     * Sorts the local user list alphabetically by user name.
     * Does nothing if the user list is null.
     */
    sortUsers() {
        if (!this.userList) {
            return;
        }
        this.userList.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Groups all users by the first letter of their names.
     * Returns a map containing the first letter as key
     * and the corresponding users as values.
     */
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

    /**
     * Selects a user and updates the selected user ID in the contact service.
     * Emits the selection event after a short delay.
     * @param id - ID of the user to select.
     */
    selectUser(id: number) {
        this.dbService.selectedUserID.set(null);
        (setTimeout(() => {
            this.dbService.selectedUserID.set(id);
            this.isUserSelected.emit(true);
        }),
            100);
    }

    /**
     * Scrolls the currently selected user into view.
     * Uses smooth scrolling and positions the user as close to the visible area as possible.
     */
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
