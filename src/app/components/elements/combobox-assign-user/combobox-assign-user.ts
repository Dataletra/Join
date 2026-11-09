import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import {
    afterRenderEffect,
    Component,
    computed,
    signal,
    viewChild,
    effect,
    inject,
    output,
    input,
} from '@angular/core';
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
    readonly initialSelectedUsers = input<number[]>([]);

    /** The combobox listbox popup. */
    readonly listbox = viewChild(Listbox);

    /** User ID in the listbox (only selected). */
    selectedValues = signal<number[]>([]);

    /** Emits the currently selected user IDs to the parent component. */
    selectedUser = output<number[]>();

    /**
     * Keeps the active listbox item visible after rendering.
     * Synchronizes the selected values with the initially provided user IDs
     * whenever the input changes.
     */
    constructor() {
        // Scrolls to the active item when the active option changes.
        afterRenderEffect(() => {
            this.listbox()?.scrollActiveItemIntoView();
        });

        effect(() => {
            this.selectedValues.set(this.initialSelectedUsers());
        });
    }

    /**
     * Emits the current user selections to the parent component.
     * @param currentSelections - Array of selected user IDs.
     */
    sendData(currentSelections: number[]) {
        this.selectedUser.emit(currentSelections);
    }

    /**
     * Retrieves the current selection and forwards it to the parent component.
     */
    triggerOutput() {
        const currentSelections = this.selectedValues();
        this.sendData(currentSelections);
    }

    /**
     * Checks whether a user matches the current search query.
     * The comparison is case-insensitive.
     * @param user - User whose name should be checked.
     * @returns True if the user's name contains the search query, otherwise false.
     */
    isUserVisible(user: IUser): boolean {
        const query = this.searchQuery().toLowerCase().trim();
        return user.name.toLowerCase().includes(query);
    }

    /** Whether the popup is expanded. */
    readonly popupExpanded = signal(false);

    /**
     * Clears all selected users and the current search query.
     * Emits an empty selection to the parent component.
     */
    requestReset() {
        this.selectedValues.set([]);
        this.sendData([]);
        this.searchQuery.set('');
    }
}
