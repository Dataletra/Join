import { Component, input } from '@angular/core';

enum BtnType {
    Dark = 'dark',
    Light = 'light',
    CreateTask = 'createTask',
    AddTask = 'addTask',
    AddContact = 'addContact',
    Cancel = 'cancel',
}

@Component({
    imports: [],
    selector: 'app-button-primary',
    styleUrl: './button-primary.scss',
    templateUrl: './button-primary.html',
})
export class ButtonPrimary {
    readonly widthStr = input<string>('auto');
    readonly typeStr = input<string>(BtnType.Dark);
    btnSrc = new Map<string, string>([
        ['dark', ''],
        ['light', ''],
        ['createTask', './assets/icons/check.svg'],
        ['addTask', './assets/icons/add-task-plus.svg'],
        ['addContact', './assets/icons/add-contact.svg'],
        ['cancel', './assets/icons/close.svg'],
    ]);
}
