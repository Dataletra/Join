import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISubtask } from '../../../interfaces/isubtask';
@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-subtask',
    styleUrl: './subtask.scss',
    templateUrl: './subtask.html',
})
export class Subtask {
    subtaskItems: ISubtask[] = [];

    subtaskEntry = new FormControl('', {
        validators: [Validators.minLength(5)],
    });

    cancel() {
        this.subtaskEntry.reset();
    }

    confirm() {
        const newSubtask: ISubtask = {
            title: this.subtaskEntry.value!,
            completed: false,
        };
        this.subtaskItems.push(newSubtask);
        this.subtaskEntry.reset();
    }

    openEdit(editCont: HTMLElement, saveCont: HTMLElement, input: HTMLInputElement) {
        editCont.classList.add('d-none');
        saveCont.classList.remove('d-none');
        input.disabled = false;
        input.focus();
    }

    saveEdit(index: number, newTitle: string, editCont: HTMLElement, saveCont: HTMLElement, input: HTMLInputElement) {
        this.subtaskItems[index].title = newTitle;
        saveCont.classList.add('d-none');
        editCont.classList.remove('d-none');
        input.disabled = true;
    }

    delete(index: number) {
        this.subtaskItems.splice(index, 1);
    }
}
