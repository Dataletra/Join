import { Component } from '@angular/core';
import { IcContact } from '../../elements/ic-contact/ic-contact';

@Component({
    imports: [IcContact],
    selector: 'app-task-card',
    styleUrl: './task-card.scss',
    templateUrl: './task-card.html',
})
export class TaskCard {}
