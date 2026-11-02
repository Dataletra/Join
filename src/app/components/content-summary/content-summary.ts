import { Component, computed, inject, signal } from '@angular/core';
import { TasksService } from '../../services/tasks-service';
import { ITask } from '../../interfaces/itask';
import { Priority, Status } from '../../interfaces/enums';

@Component({
    imports: [],
    selector: 'app-content-summary',
    styleUrl: './content-summary.scss',
    templateUrl: './content-summary.html',
})
export class ContentSummary {
    tasksService = inject(TasksService);
    readonly todo = computed(() => this.tasksService.tasklist().filter((t) => t.status === Status.todo));
    readonly progress = computed(() => this.tasksService.tasklist().filter((t) => t.status === Status.progress));
    readonly feedback = computed(() => this.tasksService.tasklist().filter((t) => t.status === Status.await));
    readonly done = computed(() => this.tasksService.tasklist().filter((t) => t.status === Status.done));
    readonly total = computed(
        () => this.todo().length + this.progress().length + this.feedback().length + this.done().length
    );

    async ngOnInit() {
        await this.tasksService.fetchTasks();
        console.log(this.todo());
    }
}

/*TODO
Render current status of all tasks on board

Dealine flow:
Call board, how many / which priority deadlines next day? -> 1 5 2 -> 
if priorityDiversity = 3    -> render custom div (left side of deadline container)
if priorityDiversity = 2    -> render custom div (left side of deadline container)
if priorityDiversity = 1    -> render custom div (left side of deadline container)

Good morning / Evening / Day message dependent on time of day
Render name of currently logged in user
*/
