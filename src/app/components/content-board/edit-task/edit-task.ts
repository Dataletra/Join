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
            element.close();
        }
    }

    onDialogClose() {
        if (this.dialogService.mode() === 'task') {
            return;
        }
        this.dialogService.close();
    }

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

    trimmedUserIc = computed(() => {
        return '+ ' + (this.comboboxUsers().length - 3);
    });

    assignedUsers(selectedIds: number[]) {
        this.comboboxUsers.set(this.contactService.userList.filter((userObj) => selectedIds.includes(userObj.id)));
        this.selectedUserIds.set(selectedIds);
    }

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

    private sameValues(a: unknown, b: unknown): boolean {
        return JSON.stringify(a) === JSON.stringify(b);
    }

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
            await this.tasksService.editTask(updatedTask, true);
        }
        this.dialogService.close();
    }
}
