import { Component, inject, input, signal } from '@angular/core';
import { ButtonPriority } from '../elements/button-priority/button-priority';
import { ComboboxCategory } from '../elements/combobox-category/combobox-category';
import { ComboboxAssignUser } from '../elements/combobox-assign-user/combobox-assign-user';
import { ContactService } from '../../services/contact-service';
import { IUser } from '../../interfaces/iuser';
import { IcContact } from '../elements/ic-contact/ic-contact';
import { Subtask } from '../elements/subtask/subtask';

@Component({
    imports: [ButtonPriority, ComboboxCategory, ComboboxAssignUser, IcContact, Subtask],
    selector: 'app-content-add-task',
    styleUrl: './content-add-task.scss',
    templateUrl: './content-add-task.html',
})
export class ContentAddTask {
    dbService = inject(ContactService);
    comboboxUserIDs = signal<IUser[]>([]);

    assignedUsers(selectedIds: number[]) {
        this.comboboxUserIDs.set(this.dbService.userList.filter((userObj) => selectedIds.includes(userObj.id)));
    }
}
