import { Component, input, signal } from '@angular/core';
import { ITask } from '../../../interfaces/itask';

@Component({
    imports: [],
    selector: 'app-task-label',
    styleUrl: './task-label.scss',
    templateUrl: './task-label.html',
})
export class Tasklabel {
    readonly category = input.required<ITask['category']>();
    maxWidthStr = input<string>("auto");
}
