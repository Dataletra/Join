import { Component, computed, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { TaskLable } from '../../elements/task-lable/task-lable';
import { ITask } from '../../../interfaces/itask';
import { Status } from '../../../interfaces/status';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ContactService } from '../../../services/contact-service';

@Component({
    imports: [TaskLable, IcContact],
    selector: 'app-detail-view',
    styleUrl: './detail-view.scss',
    templateUrl: './detail-view.html',
})
export class DetailView {
    contactService = inject(ContactService);
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('taskdetail');

    // readonly task = input.required<ITask>();

    //TODO just for tests
    readonly task = input<ITask>({
        id: 1,
        created_at: '2026-10-15',
        title: 'das ist ein sehr, sehr langer Titel',
        description: 'Lorem ipsum dolor sit amet.',
        category: 'Technical Task',
        priority: 'urgent',
        status: Status.todo,
        user_ids: [15, 23, 31, 43, 50],
        subtasks: [
            { title: 'Test Subtask 1', completed: false },
            { title: 'Test Subtask 2', completed: true },
        ],
        due_date: '2026-10-30',
    });

    //TODO  Delete and get data from task-card
    assignedUsers = computed(() => {
        const userIds = this.task().user_ids;
        const users = this.contactService.users();
        return userIds.map((id) => users.find((user) => user.id === id)).filter((user) => user !== undefined);
    });

    constructor() {
        effect(() => {
            this.openClose();
        });
    }

    openClose() {
        const isOpen = this.dialogService.isOpen() && this.dialogService.mode() === 'task';
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
}
