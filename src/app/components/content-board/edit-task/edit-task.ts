import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { ContactDialog } from '../../../services/contact-dialog';

@Component({
    imports: [],
    selector: 'app-edit-task',
    styleUrl: './edit-task.scss',
    templateUrl: './edit-task.html',
})
export class EditTask {
    dialogService = inject(ContactDialog);
    dialog = viewChild<ElementRef<HTMLDialogElement>>('edittask');

    constructor() {
        effect(() => {
            this.openClose();
        });
    }

    openClose() {
        const isOpen = this.dialogService.isOpen() && this.dialogService.mode() === 'edit-task';
        const dialogRef = this.dialog();
        if (!dialogRef) {
            return;
        }
        const element = dialogRef.nativeElement;
        if (isOpen && !element.open) {
            element.showModal();
        }
        if (!isOpen && element.open) {
            element.close();
        }
    }
}
