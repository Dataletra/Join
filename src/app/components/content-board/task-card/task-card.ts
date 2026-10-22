import { Component, computed, inject, input, output } from '@angular/core';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ITask } from '../../../interfaces/itask';
import { TaskLable } from '../../elements/task-lable/task-lable';
import { ContactService } from '../../../services/contact-service';

@Component({
    imports: [IcContact, TaskLable],
    selector: 'app-task-card',
    styleUrl: './task-card.scss',
    templateUrl: './task-card.html',
})
export class TaskCard {
    readonly task = input.required<ITask>();
    readonly taskClicked = output<ITask>();

    contactService = inject(ContactService);

    assignedUsers = computed(() => {
        const userIds = this.task().user_ids;
        const users = this.contactService.users();
        return userIds.map((id) => users.find((user) => user.id === id)).filter((user) => user !== undefined);
    });

    onTaskClick() {
        this.taskClicked.emit(this.task());
    }

    get completedSubtasks(): number {
        return this.task().subtasks.filter((subtask) => subtask.completed).length;
    }

    get progress(): number {
        const total = this.task().subtasks.length;
        if (total === 0) {
            return 0;
        }
        return (this.completedSubtasks / total) * 100;
    }
}
