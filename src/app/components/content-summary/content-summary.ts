import { Component, computed, effect, inject, signal } from '@angular/core';
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
    nextDeadlineTasks: ITask[] = [];
    readonly showcasedDateInfo = signal<'Upcoming Deadline' | 'Overdue Deadline'>('Upcoming Deadline');

    DateFormatOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    showcasedDate: string = '';

    constructor() {
        this.tasksService.fetchTasks();

        effect(() => {
            let currentCheckDate: Date | null;
            this.tasksService.tasklist().filter((element) => {
                const dueDate = new Date(element.due_date);
                if (currentCheckDate == undefined) {
                    currentCheckDate = dueDate;
                }
                if (dueDate < currentCheckDate) {
                    currentCheckDate = dueDate;
                }
            });

            this.updateShowcasedDateInfo(currentCheckDate!);

            let incomingDeadlineTasks = this.tasksService.tasklist().filter((element) => {
                const dueDate = new Date(element.due_date);
                return dueDate.valueOf() === currentCheckDate!.valueOf();
            });

            this.nextDeadlineTasks = incomingDeadlineTasks;
            console.log(this.nextDeadlineTasks);
        });
    }

    updateShowcasedDateInfo(currentCheckDate: Date) {
        this.showcasedDate = new Date(currentCheckDate).toLocaleString(undefined, this.DateFormatOptions);
        if (currentCheckDate < new Date()) {
            this.showcasedDateInfo.set('Overdue Deadline');
        }
    }

    ngOnInit() {}
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
