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
import { Task } from '../models/task';
import { Status } from '../../interfaces/enums';

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
    comboboxUserIDs = signal<IUser[]>([]); //TODO: Change so that only ID's are moved
    IncomingSubtasks = signal<ISubtask[]>([]);
    IncomingCategory = signal<string>('');
    IncomingPriority = signal<string>('');
    isCategoryTouched = signal<boolean>(false);

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

    submitForm() {
        const formValues = this.addTaskForm.value;

        const newTask = new Task({
            title: formValues.title ?? '',
            description: formValues.description ?? '',
            category: this.IncomingCategory() as 'Technical Task' | 'User Story',
            due_date: formValues.date ?? '',
            priority: this.IncomingPriority() as 'lowPrio' | 'medPrio' | 'hiPrio',
            status: Status.todo,
            user_ids: [1],
            subtasks: this.IncomingSubtasks(),
        });

        console.log('Task Payload:', newTask.getCleanAddJson());
    }
}
