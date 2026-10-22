import { Component, computed, inject, input, signal } from '@angular/core';
import { ButtonPriority } from '../elements/button-priority/button-priority';
import { ComboboxCategory } from '../elements/combobox-category/combobox-category';
import { ComboboxAssignUser } from '../elements/combobox-assign-user/combobox-assign-user';
import { ContactService } from '../../services/contact-service';
import { IUser } from '../../interfaces/iuser';
import { IcContact } from '../elements/ic-contact/ic-contact';
import { Subtask } from '../elements/subtask/subtask';
import { ISubtask } from '../../interfaces/isubtask';

@Component({
    imports: [ButtonPriority, ComboboxCategory, ComboboxAssignUser, IcContact, Subtask],
    selector: 'app-content-add-task',
    styleUrl: './content-add-task.scss',
    templateUrl: './content-add-task.html',
})
export class ContentAddTask {
    dbService = inject(ContactService);
    comboboxUserIDs = signal<IUser[]>([]);
    IncomingSubtasks = signal<ISubtask[]>([]);
    IncomingCategory = signal<string>('');
    IncomingPriority = signal<string>('');

    trimmedUserIc = computed(() => {
        return '+ ' + (this.comboboxUserIDs().length - 3);
    });

    assignedUsers(selectedIds: number[]) {
        this.comboboxUserIDs.set(this.dbService.userList.filter((userObj) => selectedIds.includes(userObj.id)));
    }

    importSubtasks(taskArray: ISubtask[]) {
        this.IncomingSubtasks.set(taskArray);
    }

    importCategory(category: string) {
        this.IncomingCategory.set(category);
        console.log(this.IncomingPriority());
    }

    importPriority(priority: string) {
        this.IncomingPriority.set(priority);
    }
    // test() {
    //     // console.log(this.comboboxUserIDs().length);
    //     console.warn(this.IncomingSubtasks());
    // }
}
