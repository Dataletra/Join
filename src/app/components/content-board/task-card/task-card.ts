import { Component, input } from '@angular/core';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { Itask } from '../../../interfaces/itask';

@Component({
    imports: [IcContact],
    selector: 'app-task-card',
    styleUrl: './task-card.scss',
    templateUrl: './task-card.html',
})
export class TaskCard {
    readonly task = input.required<Itask>();
}
