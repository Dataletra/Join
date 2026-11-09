import { afterNextRender, Component, computed, effect, inject, signal } from '@angular/core';
import { TasksService } from '../../services/tasks-service';
import { ITask } from '../../interfaces/itask';
import { Priority, Status } from '../../interfaces/enums';
import { DeadlineMetric } from '../elements/deadline-metric/deadline-metric';
import { Authentication } from '../../services/authentication';
import { TrackableNavigate } from '../../services/trackable-navigate';

@Component({
    imports: [DeadlineMetric],
    selector: 'app-content-summary',
    styleUrl: './content-summary.scss',
    templateUrl: './content-summary.html',
})
export class ContentSummary {
    tasksService = inject(TasksService);
    authService = inject(Authentication);
    navService = inject(TrackableNavigate);

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

    static showWelcome: boolean = true;
    showWelcome = ContentSummary.showWelcome;

    greetingMessage = signal<string>('Good morning');
    priorityDiversity = signal<number>(0);

    DateFormatOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    nextDeadlineTasks = signal<ITask[]>([]);
    showcasedDate: string = '';
    isDeadlineHovered: boolean = false;

    /**
     * Initializes the summary component.
     * Hides the welcome message after the initial render, fetches tasks
     * and observes task data to determine the earliest deadline and its priorities.
     */
    constructor() {
        afterNextRender(() => {
            ContentSummary.showWelcome = false;
        });
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

            this.nextDeadlineTasks.set(incomingDeadlineTasks);
            this.updatePriorityDiversity();
        });
    }

    /**
     * Formats the given deadline date and determines whether it is overdue or upcoming.
     * @param currentCheckDate - The earliest deadline date to display.
     */
    updateShowcasedDateInfo(currentCheckDate: Date) {
        this.showcasedDate = new Date(currentCheckDate).toLocaleString(undefined, this.DateFormatOptions);
        if (currentCheckDate < new Date()) {
            this.showcasedDateInfo.set('Overdue Deadline');
        } else {
            this.showcasedDateInfo.set('Upcoming Deadline');
        }
    }

    /**
     * Calculates how many different priority levels are represented
     * among the tasks with the next deadline.
     * Updates the priority diversity signal accordingly.
     */
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

    /**
     * Sets the greeting message according to the current time of day.
     * Adds a comma if a user is logged in, otherwise an exclamation mark.
     */
    ngOnInit() {
        const date = new Date();
        let currentTOD = date.getHours();
        if (currentTOD >= 0 && currentTOD < 12) {
            this.greetingMessage.set('Good morning');
        } else if (currentTOD >= 12 && currentTOD < 17) {
            this.greetingMessage.set('Good afternoon');
        } else if (currentTOD >= 17 && currentTOD < 24) {
            this.greetingMessage.set('Good evening');
        }
        this.greetingMessage.set(this.greetingMessage() + (this.authService.currentUser() ? ',' : '!'));
    }

    /**
     * Enables the welcome message again.
     * Updates both the static property and the current component instance.
     */
    setWelcome() {
        ContentSummary.showWelcome = true;
        this.showWelcome = true;
    }
}
