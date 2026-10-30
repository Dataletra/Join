import { Component, computed, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { Tasklabel } from '../../elements/task-label/task-label';
import { ITask } from '../../../interfaces/itask';
import { Status } from '../../../interfaces/enums';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ContactService } from '../../../services/contact-service';
import { TasksService } from '../../../services/tasks-service';
import { Task } from '../../models/task';
import { TitleCasePipe } from '@angular/common';
import { Toast, ToastType } from '../../../services/toast';

@Component({
    imports: [Tasklabel, IcContact, TitleCasePipe],
    selector: 'app-detail-view',
    styleUrl: './detail-view.scss',
    templateUrl: './detail-view.html',
})
export class DetailView {
    contactService = inject(ContactService);
    taskService = inject(TasksService);
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('taskdetail');
    subtaskUpdateQueue: Promise<void> = Promise.resolve();
    readonly task = computed(() => this.dialogService.selectedTask());
    toastService = inject(Toast);

    assignedUsers = computed(() => {
        const task = this.task();
        if (!task) {
            return [];
        }
        const users = this.contactService.users();
        return task.user_ids.map((id) => users.find((user) => user.id === id)).filter((user) => user !== undefined);
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
            setTimeout(() => {
                element.close();
            }, 300);
        }
    }

    onDialogClose() {
        if (this.dialogService.mode() === 'edit-task') {
            return;
        }
        this.dialogService.close();
    }

    async deleteApiTask(id: number) {
        this.toastService.setTypeMatch(ToastType.deleteTask);
        await this.taskService.deleteApiTask(id);
        this.dialogService.close();
    }

    async toggleSubtask(task: ITask, index: number, event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const updatedSubtasks = task.subtasks.map((subtask, i) =>
            i === index ? { ...subtask, completed: checkbox.checked } : subtask
        );
        const updatedTask = {
            ...task,
            subtasks: updatedSubtasks,
        };
        this.dialogService.selectedTask.set(updatedTask);
        this.subtaskUpdateQueue = this.subtaskUpdateQueue.then(() =>
            this.taskService.editApiTask(new Task(updatedTask))
        );
        await this.subtaskUpdateQueue;
    }
}
