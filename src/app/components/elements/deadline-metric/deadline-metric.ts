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
    incomingLowPrioTasks = input<ITask[]>([]);
    incomingMedPrioTasks = input<ITask[]>([]);
    incomingHiPrioTasks = input<ITask[]>([]);
}
