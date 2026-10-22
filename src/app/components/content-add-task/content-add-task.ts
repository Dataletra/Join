import { Component, computed, inject, input, signal } from '@angular/core';
import { ButtonPriority } from '../elements/button-priority/button-priority';
import { ComboboxCategory } from '../elements/combobox-category/combobox-category';
import { ComboboxAssignUser } from '../elements/combobox-assign-user/combobox-assign-user';
import { ContactService } from '../../services/contact-service';
import { IUser } from '../../interfaces/iuser';
import { IcContact } from '../elements/ic-contact/ic-contact';
import { Subtask } from '../elements/subtask/subtask';
import { ISubtask } from '../../interfaces/isubtask';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { CustomValidators } from '../../services/custom-validators';

@Component({
    imports: [
        ButtonPriority,
        ComboboxCategory,
        ComboboxAssignUser,
        IcContact,
        Subtask,
        ReactiveFormsModule,
        ButtonPrimary,
    ],
    selector: 'app-content-add-task',
    styleUrl: './content-add-task.scss',
    templateUrl: './content-add-task.html',
})
export class ContentAddTask {
    dbService = inject(ContactService);
    customValidator = inject(CustomValidators);
    comboboxUserIDs = signal<IUser[]>([]);
    IncomingSubtasks = signal<ISubtask[]>([]);
    IncomingCategory = signal<string>('');
    IncomingPriority = signal<string>('');

    addTaskForm = new FormGroup({
        title: new FormControl('', { validators: [Validators.required] }),
        description: new FormControl('', { validators: [Validators.required] }),
        date: new FormControl('', { validators: [Validators.required, this.customValidator.dateValidator] }),
    });

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
        console.log(this.addTaskForm.value);
    }

    importPriority(priority: string) {
        this.IncomingPriority.set(priority);
    }

    isTaskValid() {
        if (this.addTaskForm.valid && this.IncomingCategory() != '') {
            return true;
        } else {
            return false;
        }
    }
}
