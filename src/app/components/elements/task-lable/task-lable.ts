import { Component, input } from '@angular/core';
import { ITask } from '../../../interfaces/itask';

@Component({
    imports: [],
    selector: 'app-task-lable',
    styleUrl: './task-lable.scss',
    templateUrl: './task-lable.html',
})
export class TaskLable {
    readonly category = input.required<ITask['category']>();
}
