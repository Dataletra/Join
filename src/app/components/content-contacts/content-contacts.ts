import { Component } from '@angular/core';
import { Namelist } from './namelist/namelist';
import { MainView } from './main-view/main-view';

@Component({
    imports: [Namelist, MainView],
    selector: 'app-content-contacts',
    styleUrl: './content-contacts.scss',
    templateUrl: './content-contacts.html',
})
export class ContentContacts {}
