import { Component, input } from '@angular/core';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ITask } from '../../../interfaces/itask';

@Component({
    imports: [IcContact],
    selector: 'app-task-card',
    styleUrl: './task-card.scss',
    templateUrl: './task-card.html',
})
export class TaskCard {
    readonly task = input.required<ITask>();

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
