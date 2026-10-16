import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { afterRenderEffect, Component, computed, signal, viewChild, effect, inject } from '@angular/core';
import { Namelist } from '../../content-contacts/namelist/namelist';
import { ContactService } from '../../../services/contact-service';
import { IcContact } from '../ic-contact/ic-contact';
import { TitleCasePipe } from '@angular/common';

@Component({
    imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, OverlayModule, IcContact, TitleCasePipe],
    selector: 'app-combobox-assign-user',
    styleUrl: './combobox-assign-user.scss',
    templateUrl: './combobox-assign-user.html',
})
export class ComboboxAssignUser {
    dbService = inject(ContactService);

    // ngOnInit() {
    //     this.fetchUsers();
    // }

    // async fetchUsers() {
    //     await this.dbService.getUsers();
    // }
    /** The combobox listbox popup. */
    readonly listbox = viewChild(Listbox);

    /** The options available in the listbox. */
    readonly selectedValues = signal<string[]>([]);

    /** The icon that is displayed in the combobox. */
    readonly displayIcon = computed(() => {
        const values = this.selectedValues();
        const label = this.labels.find((label) => label.value === values[0]);
        return label ? label.icon : '';
    });

    /** The string that is displayed in the combobox. */
    readonly displayValue = computed(() => {
        const values = this.selectedValues();
        if (values.length === 0) {
            return 'Select contacts to assign';
        }
        if (values.length === 1) {
            return values[0];
        }
        return `${values[0]} + ${values.length - 1} more`;
    });

    /** The labels that are available for selection. */
    readonly labels = [
        { value: 'Important', icon: 'label' },
        { value: 'Starred', icon: 'star' },
        { value: 'Work', icon: 'work' },
        { value: 'Personal', icon: 'person' },
        { value: 'To Do', icon: 'checklist' },
        { value: 'Later', icon: 'schedule' },
        { value: 'Read', icon: 'menu_book' },
        { value: 'Travel', icon: 'flight' },
    ];

    /** Whether the popup is expanded. */
    readonly popupExpanded = signal(false);

    constructor() {
        // Scrolls to the active item when the active option changes.
        afterRenderEffect(() => {
            this.listbox()?.scrollActiveItemIntoView();
        });
    }
}
