import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../../services/custom-validators';
import { ButtonPrimary } from '../../elements/button-primary/button-primary';
import { ComboboxAssignUser } from '../../elements/combobox-assign-user/combobox-assign-user';
import { ButtonPriority } from '../../elements/button-priority/button-priority';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ISubtask } from '../../../interfaces/isubtask';
import { Status } from '../../../interfaces/enums';
import { IUser } from '../../../interfaces/iuser';
import { ContactService } from '../../../services/contact-service';
import { Subtask } from '../../elements/subtask/subtask';
import { TasksService } from '../../../services/tasks-service';
import { Task } from '../../models/task';
import { ComboboxCategory } from '../../elements/combobox-category/combobox-category';

@Component({
    imports: [
        ButtonPriority,
        ComboboxAssignUser,
        ComboboxCategory,
        IcContact,
        Subtask,
        ButtonPrimary,
        ReactiveFormsModule,
    ],
    selector: 'app-edit-task',
    styleUrl: './edit-task.scss',
    templateUrl: './edit-task.html',
})
export class EditTask {
    contactService = inject(ContactService);
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('edittask');
    customValidator = inject(CustomValidators);
    comboboxUsers = signal<IUser[]>([]);
    selectedUserIds = signal<number[]>([]);
    IncomingSubtasks = signal<ISubtask[]>([]);
    IncomingCategory = signal<string>('');
    IncomingPriority = signal<string>('');
    IncomingStatus = signal<string>(Status.todo);
    tasksService = inject(TasksService);
    isCategoryTouched = signal<boolean>(false);
    readonly categoryComp = viewChild(ComboboxCategory);
    readonly isPopupOpen = computed(() => this.categoryComp()?.popupExpanded() ?? false);

    /**
     * Creates effects for controlling the dialog visibility
     * and loading the selected task's data into the form.
     */
    constructor() {
        effect(() => {
            this.openClose();
        });

        effect(() => {
            const editMode = this.dialogService.isOpen() && this.dialogService.mode() === 'edit-task';
            const task = this.dialogService.selectedTask();
            if (editMode && task) {
                this.addTaskForm.setValue({
                    title: task.title,
                    description: task.description,
                    date: task.due_date,
                });
                this.IncomingPriority.set(task.priority);
                this.IncomingCategory.set(task.category);
                this.assignedUsers(task.user_ids);
                this.IncomingSubtasks.set(task.subtasks.map((subtask) => ({ ...subtask })));
            }
        });
    }

    /**
     * Opens or closes the edit-task dialog depending on its current state
     * and the active dialog mode.
     */
    openClose() {
        const isOpen = this.dialogService.isOpen() && this.dialogService.mode() === 'edit-task';
        const dialogRef = this.dialog();
        if (!dialogRef) {
            return;
        }
        const element = dialogRef.nativeElement;
        if (isOpen && !element.open) {
            element.showModal();
        }
        if (!isOpen && element.open) {
            setTimeout(() => {
                element.close();
            }, 300);
        }
    }

    /**
     * Handles the closing event of the edit-task dialog.
     * Prevents closing when switching back to the task detail view.
     */
    onDialogClose() {
        if (this.dialogService.mode() === 'task') {
            return;
        }
        this.dialogService.close();
    }

    /** Form group containing the editable task title, description and due date with their validators. */
    addTaskForm = new FormGroup({
        title: new FormControl('', { validators: [Validators.required] }),
        description: new FormControl(''),
        date: new FormControl('', {
            validators: [
                Validators.required,
                (control) => {
                    const currentTask = this.dialogService.selectedTask();
                    if (currentTask && control.value === currentTask.due_date) {
                        return null;
                    }
                    return this.customValidator.dateValidator(control);
                },
            ],
        }),
    });

    /**
     * Updates the stored subtasks with the values received from the subtask component.
     *
     * @param taskArray - Array of subtasks to be stored.
     */
    importSubtasks(taskArray: ISubtask[]) {
        this.IncomingSubtasks.set(taskArray);
    }

    /**
     * Updates the selected task category.
     *
     * @param category - Category value received from the category combobox.
     */
    importCategory(category: string) {
        this.IncomingCategory.set(category);
    }

    /**
     * Updates the selected task priority.
     *
     * @param priority - Priority value received from the priority component.
     */
    importPriority(priority: string) {
        this.IncomingPriority.set(priority);
    }

    /**
     * Updates the selected task status.
     *
     * @param status - Status value received from the status component.
     */
    importStatus(status: string) {
        this.IncomingStatus.set(status);
    }

    /** Calculates the number of additional assigned users beyond the first three. */
    trimmedUserIc = computed(() => {
        return '+ ' + (this.comboboxUsers().length - 3);
    });

    /**
     * Sets the assigned users based on their IDs.
     * Updates both the user objects displayed in the combobox and the selected ID list.
     *
     * @param selectedIds - IDs of the users assigned to the task.
     */
    assignedUsers(selectedIds: number[]) {
        this.comboboxUsers.set(this.contactService.userList.filter((userObj) => selectedIds.includes(userObj.id)));
        this.selectedUserIds.set(selectedIds);
    }

    /**
     * Checks whether any task properties have changed compared to the original task.
     *
     * @returns True if at least one property has changed, otherwise false.
     */
    hasChanges() {
        const task = this.dialogService.selectedTask();
        const formValues = this.addTaskForm.value;
        if (!task) {
            return false;
        }
        return (
            formValues.title !== task.title ||
            formValues.description !== task.description ||
            formValues.date !== task.due_date ||
            this.IncomingPriority() !== task.priority ||
            this.IncomingCategory() !== task.category ||
            !this.sameValues(this.selectedUserIds(), task.user_ids) ||
            !this.sameValues(this.IncomingSubtasks(), task.subtasks)
        );
    }

    /**
     * Compares two values by converting them to JSON strings.
     *
     * @param a - First value to compare.
     * @param b - Second value to compare.
     * @returns True if both serialized values are equal, otherwise false.
     */
    private sameValues(a: unknown, b: unknown): boolean {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    /**
     * Validates the form and saves the updated task if changes have been made.
     * Closes the dialog after processing.
     */
    async saveTask() {
        const currentTask = this.dialogService.selectedTask();
        if (!currentTask || this.addTaskForm.invalid) {
            return;
        }
        if (this.hasChanges()) {
            const formValues = this.addTaskForm.getRawValue();
            const updatedTask = new Task({
                ...currentTask,
                title: formValues.title ?? '',
                description: formValues.description ?? '',
                due_date: formValues.date ?? '',
                priority: this.IncomingPriority() as Task['priority'],
                user_ids: this.selectedUserIds(),
                category: this.IncomingCategory() as Task['category'],
                subtasks: this.IncomingSubtasks(),
            });
            await this.tasksService.editApiTask(updatedTask, true);
        }
        this.dialogService.close();
    }
}
