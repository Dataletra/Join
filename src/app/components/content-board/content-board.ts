import { Component, inject } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TaskListService } from '../../services/tasklist-service';
import { TaskList } from '../models/tasklist';
import { Status } from '../../interfaces/status';

@Component({
    imports: [ButtonPrimary],
    selector: 'app-content-board',
    styleUrl: './content-board.scss',
    templateUrl: './content-board.html',
})
export class ContentBoard {
    taskListService = inject(TaskListService);

    ngOnInit() {
        this.fetchTaskLists();

    }

    async fetchTaskLists() {
        await this.taskListService.getTaskLists();

        // TODO: remove me - example how to update taskLists
        // let list = this.taskListService.getStatusList(Status.await);
        // if (list) {
        //     list.order = [];
        // }
        // this.taskListService.editTaskList(list);
    }
}
