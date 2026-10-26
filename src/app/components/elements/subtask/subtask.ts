import { Component, output } from '@angular/core';
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
    subtaskOutput = output<ISubtask[]>();

    subtaskEntry = new FormControl('', {
        validators: [Validators.minLength(5)],
    });

    cancel() {
        this.subtaskEntry.reset();
    }

    // log() {
    //     console.log(this.subtaskItems);
    //     this.subtaskOutput.emit(this.subtaskItems);
    // }

    confirm() {
        if (!this.subtaskEntry.value) {
            return;
        }
        const newSubtask: ISubtask = {
            title: this.subtaskEntry.value!,
            completed: false,
        };
        this.subtaskItems.push(newSubtask);
        this.subtaskEntry.reset();
        this.subtaskOutput.emit(this.subtaskItems);
    }

    openEdit(editCont: HTMLElement, saveCont: HTMLElement, input: HTMLInputElement) {
        editCont.classList.add('d-none');
        saveCont.classList.remove('d-none');
        input.disabled = false;
        input.focus();
        input.closest('li')?.classList.add('editing');
    }

    saveEdit(index: number, newTitle: string, editCont: HTMLElement, saveCont: HTMLElement, input: HTMLInputElement) {
        this.subtaskItems[index].title = newTitle;
        saveCont.classList.add('d-none');
        editCont.classList.remove('d-none');
        input.disabled = true;
        input.closest('li')?.classList.remove('editing');
        this.subtaskOutput.emit(this.subtaskItems);
    }

    delete(index: number) {
        this.subtaskItems.splice(index, 1);
        this.subtaskOutput.emit(this.subtaskItems);
    }
}
