import { Component, computed, inject, Input, input, signal, viewChild } from '@angular/core';
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
import { ContactDialog } from '../../services/contact-dialog';
import { Router } from '@angular/router';

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
    contactDialog = inject(ContactDialog);
    router = inject(Router);
    requestedStatus = input<Status>(Status.todo);
    comboboxUsers = signal<IUser[]>([]);
    selectedUserIds = signal<number[]>([]);
    IncomingSubtasks = signal<ISubtask[]>([]);
    IncomingCategory = signal<string>('');
    IncomingPriority = signal<string>('');
    isCategoryTouched = signal<boolean>(false);
    readonly categoryComp = viewChild(ComboboxCategory);
    readonly assignUserComp = viewChild(ComboboxAssignUser);
    readonly subtaskComp = viewChild(Subtask);
    readonly priorityBtnComp = viewChild(ButtonPriority);

    readonly isPopupOpen = computed(() => this.categoryComp()?.popupExpanded() ?? false);

    /**
     * Reactive form for creating a task.
     * Contains title, description and due date fields.
     * The title is required and cannot contain only whitespace.
     * The due date is required and validated using a custom date validator.
     */
    addTaskForm = new FormGroup({
        title: new FormControl('', {
            validators: [Validators.required, this.customValidator.containsOnlyWhitespaceValidator()],
        }),
        description: new FormControl('', {}),
        date: new FormControl('', { validators: [Validators.required, this.customValidator.dateValidator] }),
    });

    /** Calculates the number of assigned users exceeding the three displayed avatars. */
    trimmedUserIc = computed(() => {
        return '+ ' + (this.comboboxUsers().length - 3);
    });

    /**
     * Updates the assigned user objects and their corresponding IDs.
     * @param selectedIds - IDs of the users selected in the assignment combobox.
     */
    assignedUsers(selectedIds: number[]) {
        this.comboboxUsers.set(this.contactService.userList.filter((userObj) => selectedIds.includes(userObj.id)));
        this.selectedUserIds.set(selectedIds);
    }

    /**
     * Updates the list of subtasks received from the subtask component.
     * @param taskArray - Array containing the selected subtasks.
     */
    importSubtasks(taskArray: ISubtask[]) {
        this.IncomingSubtasks.set(taskArray);
    }

    /**
     * Updates the selected task category.
     * @param category - Selected category.
     */
    importCategory(category: string) {
        this.IncomingCategory.set(category);
    }

    /**
     * Updates the selected task priority.
     * @param priority - Selected priority.
     */
    importPriority(priority: string) {
        this.IncomingPriority.set(priority);
    }

    /**
     * Checks whether the required task form fields and category are valid.
     * @returns True if the form is valid and a category has been selected, otherwise false.
     */
    isTaskValid() {
        if (this.addTaskForm.valid && this.IncomingCategory() != '') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Creates a new task using the entered form data and selected options.
     * Saves the task through the task service, navigates to the board
     * and closes the task dialog.
     */
    async submitForm() {
        const formValues = this.addTaskForm.value;

        const newTask = new Task({
            title: formValues.title ?? '',
            description: formValues.description?.trim() ?? '',
            category: this.IncomingCategory() as 'Technical Task' | 'User Story',
            due_date: formValues.date ?? '',
            priority: this.IncomingPriority() as Priority,
            status: this.requestedStatus() as Status,
            user_ids: this.selectedUserIds(),
            subtasks: this.IncomingSubtasks(),
        });
        await this.tasksService.addApiTask(newTask);
        this.router.navigate(['/board']);

        this.contactDialog.close();
    }

    /**
     * Resets the task form and all child components.
     * Clears assigned users, subtasks and category,
     * resets the category touched state and restores medium priority.
     */
    clearForm() {
        this.addTaskForm.reset();
        this.assignUserComp()?.requestReset();
        this.subtaskComp()?.requestReset();
        this.categoryComp()?.requestReset();
        this.isCategoryTouched.set(false);
        this.priorityBtnComp()?.toggleActiveState('medium');
    }
}
