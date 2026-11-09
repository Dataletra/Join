import { Component, signal } from '@angular/core';
import { Namelist } from './namelist/namelist';
import { MainView } from './main-view/main-view';

@Component({
    imports: [Namelist, MainView],
    selector: 'app-content-contacts',
    styleUrl: './content-contacts.scss',
    templateUrl: './content-contacts.html',
})
export class ContentContacts {
    showMainView = signal<boolean>(false);

    /**
     * Set or unset if a user is currently selected. 
     * @param isSelected {boolean} - set showMainView to value
     */
    handleUserSelectedStatus(isSelected: boolean) {
        this.showMainView.set(isSelected);
    }
}
