import { Component, inject } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TaskListService } from '../../services/tasklist-service';

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
        console.log(this.taskListService.taskLists());
    }
}
