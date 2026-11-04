import { Component, computed, effect, inject, signal } from '@angular/core';
import { TasksService } from '../../services/tasks-service';
import { ITask } from '../../interfaces/itask';
import { Priority, Status } from '../../interfaces/enums';
import { DeadlineMetric } from '../elements/deadline-metric/deadline-metric';

@Component({
    imports: [DeadlineMetric],
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
    readonly showcasedDateInfo = signal<'Upcoming Deadline' | 'Overdue Deadline'>('Upcoming Deadline');
    readonly deadlineLowPrioTasks = computed(() => this.nextDeadlineTasks().filter((t) => t.priority === Priority.low));
    readonly deadlineMedPrioTasks = computed(() =>
        this.nextDeadlineTasks().filter((t) => t.priority === Priority.medium)
    );
    readonly deadlineHiPrioTasks = computed(() =>
        this.nextDeadlineTasks().filter((t) => t.priority === Priority.urgent)
    );

    greetingMessage = signal<'Good morning,' | 'Good afternoon,' | 'Good evening,'>('Good morning,');
    priorityDiversity = signal<number>(0);

    DateFormatOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    nextDeadlineTasks = signal<ITask[]>([]);
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

            console.log(currentCheckDate!);
            this.updateShowcasedDateInfo(currentCheckDate!);

            let incomingDeadlineTasks = this.tasksService.tasklist().filter((element) => {
                const dueDate = new Date(element.due_date);
                return dueDate.valueOf() === currentCheckDate!.valueOf();
            });

            this.nextDeadlineTasks.set(incomingDeadlineTasks);
            this.updatePriorityDiversity();
        });
    }

    updateShowcasedDateInfo(currentCheckDate: Date) {
        this.showcasedDate = new Date(currentCheckDate).toLocaleString(undefined, this.DateFormatOptions);
        if (currentCheckDate < new Date()) {
            this.showcasedDateInfo.set('Overdue Deadline');
        } else {
            this.showcasedDateInfo.set('Upcoming Deadline');
        }
    }

    updatePriorityDiversity() {
        let calculatedDiversity = 0;
        if (this.deadlineLowPrioTasks().length >= 1) {
            calculatedDiversity++;
        }
        if (this.deadlineMedPrioTasks().length >= 1) {
            calculatedDiversity++;
        }
        if (this.deadlineHiPrioTasks().length >= 1) {
            calculatedDiversity++;
        }
        this.priorityDiversity.set(calculatedDiversity);
    }
    ngOnInit() {
        const date = new Date();
        let currentTOD = date.getHours();
        if (currentTOD >= 0 && currentTOD < 12) {
            this.greetingMessage.set('Good morning,');
        } else if (currentTOD >= 12 && currentTOD < 17) {
            this.greetingMessage.set('Good afternoon,');
        } else if (currentTOD >= 17 && currentTOD < 24) {
            this.greetingMessage.set('Good evening,');
        }
    }
}

/*TODO
Dealine flow:
Call board, how many / which priority deadlines next day? -> 1 5 2 -> 
if priorityDiversity = 3    -> render custom div (left side of deadline container)
if priorityDiversity = 2    -> render custom div (left side of deadline container)
if priorityDiversity = 1    -> render custom div (left side of deadline container)

Good morning / Evening / Day message dependent on time of day
Render name of currently logged in user
*/
