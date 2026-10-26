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
import { Priority, Status } from '../../interfaces/enums';
import { TasksService } from '../../services/tasks-service';

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
    contactService = inject(ContactService);
    tasksService = inject(TasksService);
    customValidator = inject(CustomValidators);
    comboboxUsers = signal<IUser[]>([]);
    selectedUserIds = signal<number[]>([]);
    IncomingSubtasks = signal<ISubtask[]>([]);
    IncomingCategory = signal<string>('');
    IncomingPriority = signal<string>('');
    IncomingStatus = signal<string>(Status.todo);
    isCategoryTouched = signal<boolean>(false);

    addTaskForm = new FormGroup({
        title: new FormControl('', { validators: [Validators.required] }),
        description: new FormControl('', { validators: [Validators.required] }),
        date: new FormControl('', { validators: [Validators.required, this.customValidator.dateValidator] }),
    });

    trimmedUserIc = computed(() => {
        return '+ ' + (this.comboboxUsers().length - 3);
    });

    assignedUsers(selectedIds: number[]) {
        this.comboboxUsers.set(this.contactService.userList.filter((userObj) => selectedIds.includes(userObj.id)));
        this.selectedUserIds.set(selectedIds);
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

    importStatus(status: string) {
        this.IncomingStatus.set(status);
    }

    isTaskValid() {
        if (this.addTaskForm.valid && this.IncomingCategory() != '') {
            return true;
        } else {
            return false;
        }
    }

    async submitForm() {
        const formValues = this.addTaskForm.value;

        const newTask = new Task({
            title: formValues.title ?? '',
            description: formValues.description ?? '',
            category: this.IncomingCategory() as 'Technical Task' | 'User Story',
            due_date: formValues.date ?? '',
            priority: this.IncomingPriority() as Priority,
            status: this.IncomingStatus() as Status,
            user_ids: this.selectedUserIds(),
            subtasks: this.IncomingSubtasks(),
        });
        await this.tasksService.addTask(newTask);

        console.log('Task Payload:', newTask.getCleanAddJson());
    }
}
