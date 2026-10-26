import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';

@Component({
    imports: [],
    selector: 'app-add-task',
    styleUrl: './add-task.scss',
    templateUrl: './add-task.html',
})
export class AddTask {
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('addTaskDialog');

    constructor() {
        effect(() => {
            this.openClose();
        });
    }

    openClose() {
        const isOpen = this.dialogService.isOpen() && this.dialogService.mode() === 'add-task';
        const dialogRef = this.dialog();
        if (!dialogRef) {
            return;
        }
        const element = dialogRef.nativeElement;
        if (isOpen && !element.open) {
            element.showModal();
        }
        if (!isOpen && element.open) {
            setTimeout(() => {
                element.close();
            }, 300);
        }
    }
}
