import { Component, signal } from '@angular/core';
import { Namelist } from './namelist/namelist';
import { MainView } from './main-view/main-view';
import { AddContact } from './add-contact/add-contact';
import { EditContact } from './edit-contact/edit-contact';

@Component({
    imports: [Namelist, MainView, AddContact, EditContact],
    selector: 'app-content-contacts',
    styleUrl: './content-contacts.scss',
    templateUrl: './content-contacts.html',
})
export class ContentContacts {
    showMainView = signal<boolean>(false);

    handleUserSelectedStatus(isSelected: boolean) {
        this.showMainView.set(isSelected);
    }
}
