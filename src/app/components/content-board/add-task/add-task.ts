import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';
import { ContentAddTask } from '../../content-add-task/content-add-task';

@Component({
    imports: [ContentAddTask],
    selector: 'app-add-task',
    styleUrl: './add-task.scss',
    templateUrl: './add-task.html',
})
export class AddTask {
    readonly contentAddTaskComp = viewChild(ContentAddTask);
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('addTaskDialog');

    /**
     * Observes changes to the dialog service state
     * and updates the dialog visibility accordingly.
     */
    constructor() {
        effect(() => {
            this.openClose();
        });
    }

    /**
     * Opens or closes the task dialog depending on the current dialog state.
     * Clears the task form before opening and delays closing to allow
     * the closing animation to finish.
     */
    openClose() {
        const isOpen = this.dialogService.isOpen() && this.dialogService.mode() === 'add-task';
        const dialogRef = this.dialog();
        if (!dialogRef) {
            return;
        }
        const element = dialogRef.nativeElement;
        if (isOpen && !element.open) {
            this.contentAddTaskComp()?.clearForm();
            element.showModal();
        }
        if (!isOpen && element.open) {
            setTimeout(() => {
                element.close();
            }, 300);
        }
    }
}
