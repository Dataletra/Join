import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { afterRenderEffect, Component, computed, signal, viewChild, effect, inject, output } from '@angular/core';
import { Namelist } from '../../content-contacts/namelist/namelist';
import { ContactService } from '../../../services/contact-service';
import { IcContact } from '../ic-contact/ic-contact';
import { TitleCasePipe } from '@angular/common';
import { IUser } from '../../../interfaces/iuser';
@Component({
    imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, OverlayModule, IcContact, TitleCasePipe],
    selector: 'app-combobox-assign-user',
    styleUrl: './combobox-assign-user.scss',
    templateUrl: './combobox-assign-user.html',
})
export class ComboboxAssignUser {
    dbService = inject(ContactService);
    searchQuery = signal('');

    readonly filteredGroupedUsers = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const originalMap = this.dbService.groupedUsers();

        if (!query) return Array.from(originalMap.entries());

        const filteredMap = new Map<string, IUser[]>();
        for (const [letter, users] of originalMap.entries()) {
            const matchingUsers = users.filter(
                (user) => user.name.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query)
            );
            if (matchingUsers.length > 0) {
                filteredMap.set(letter, matchingUsers);
            }
        }
        return Array.from(filteredMap.entries());
    });

    /** The combobox listbox popup. */
    readonly listbox = viewChild(Listbox);

    /** User ID in the listbox (only selected). */
    selectedValues = signal<number[]>([]);

    // Output for the parent component
    selectedUser = output<number[]>();

    sendData(currentSelections: number[]) {
        this.selectedUser.emit(currentSelections);
    }

    triggerOutput() {
        const currentSelections = this.selectedValues();
        this.sendData(currentSelections);
    }

    isUserVisible(user: IUser): boolean {
        const query = this.searchQuery().toLowerCase().trim();
        return user.name.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query);
    }

    /** Whether the popup is expanded. */
    readonly popupExpanded = signal(false);

    constructor() {
        // Scrolls to the active item when the active option changes.
        afterRenderEffect(() => {
            this.listbox()?.scrollActiveItemIntoView();
        });
    }
}
