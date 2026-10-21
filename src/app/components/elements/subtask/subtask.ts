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

    openEdit(container: HTMLElement) {
        container.classList.toggle('d-none');
    }

    saveEdit(index: number, newTitle: string, container: HTMLElement) {
        this.subtaskItems[index].title = newTitle;
        container.classList.toggle('d-none');
    }

    delete(index: number) {
        this.subtaskItems.splice(index, 1);
    }
}
