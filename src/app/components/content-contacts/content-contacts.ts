import { Component, inject } from '@angular/core';
import { Namelist } from './namelist/namelist';

@Component({
    imports: [Namelist],
    selector: 'app-content-contacts',
    styleUrl: './content-contacts.scss',
    templateUrl: './content-contacts.html',
})
export class ContentContacts {}
