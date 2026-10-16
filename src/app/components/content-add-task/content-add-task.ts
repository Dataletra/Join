import { Component } from '@angular/core';
import { ButtonPriority } from '../elements/button-priority/button-priority';
import { ComboboxCategory } from '../elements/combobox-category/combobox-category';
import { ComboboxAssignUser } from '../elements/combobox-assign-user/combobox-assign-user';

@Component({
    imports: [ButtonPriority, ComboboxCategory, ComboboxAssignUser],
    selector: 'app-content-add-task',
    styleUrl: './content-add-task.scss',
    templateUrl: './content-add-task.html',
})
export class ContentAddTask {}
