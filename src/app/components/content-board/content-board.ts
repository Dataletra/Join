import { Component, computed, inject } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TaskListService } from '../../services/tasklist-service';
import { Status } from '../../interfaces/status';
import { ITask } from '../../interfaces/itask';

@Component({
    imports: [ButtonPrimary],
    selector: 'app-content-board',
    styleUrl: './content-board.scss',
    templateUrl: './content-board.html',
})
export class ContentBoard {
    taskListService = inject(TaskListService);
    private readonly Status = Status; // Make Status enum usable in HTML

    ngOnInit() {
        this.fetchTaskLists();

        this.createSomeTasks();
        console.log(this.tasks);
    }

    async fetchTaskLists() {
        await this.taskListService.getTaskLists();

        // TODO: remove me - example how to update taskLists
        // this.taskListService.editTaskList({ status: Status.await, order: [] });
    }

    // TODO: testing section
    tasks: ITask[] = [];
    createSomeTasks() {
        for (let i = 1; i < 10; i++) {
            let someStatus: Status;
            switch (true) {
                case i < 3:
                    someStatus = Status.todo;
                    break;
                case i < 6:
                    someStatus = Status.progress;
                    break;
                case i < 9:
                    someStatus = Status.await;
                    break;
                default:
                    someStatus = Status.done;
                    break;
            }
            this.tasks.push({
                id: i,
                created_at: new Date().toISOString(),
                title: 'Title ' + i,
                description: 'Description ' + i,
                category: 'User Story',
                priority: 'low',
                status: someStatus,
                assignedTo: [],
                subtasks: [],
            });
        }
    }
}
