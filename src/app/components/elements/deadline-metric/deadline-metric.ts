import { Component, input } from '@angular/core';
import { ITask } from '../../../interfaces/itask';

@Component({
    imports: [],
    selector: 'app-deadline-metric',
    styleUrl: './deadline-metric.scss',
    templateUrl: './deadline-metric.html',
})
export class DeadlineMetric {
    incomingPriorityDiversity = input<number>();
    incomingDate = input<string>();
    deadlineLowPrioTasks = input<ITask[]>([]);
    deadlineMedPrioTasks = input<ITask[]>([]);
    deadlineHiPrioTasks = input<ITask[]>([]);
}
