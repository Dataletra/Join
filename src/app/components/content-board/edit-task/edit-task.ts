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

@Component({
    imports: [ButtonPriority, ComboboxAssignUser, IcContact, Subtask, ButtonPrimary, ReactiveFormsModule],
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

    addTaskForm = new FormGroup({
        title: new FormControl('', { validators: [Validators.required] }),
        description: new FormControl('', { validators: [Validators.required] }),
        date: new FormControl('', { validators: [Validators.required, this.customValidator.dateValidator] }),
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
}
