import { Component, effect, inject, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISubtask } from '../../../interfaces/isubtask';
import { CustomValidators } from '../../../services/custom-validators';
@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-subtask',
    styleUrl: './subtask.scss',
    templateUrl: './subtask.html',
})
export class Subtask {
    customValidator = inject(CustomValidators);
    subtaskItems: ISubtask[] = [];
    subtaskOutput = output<ISubtask[]>();
    initialSubtasks = input<ISubtask[]>([]);

    subtaskEntry = new FormControl('', {
        validators: [Validators.minLength(1), this.customValidator.containsOnlyWhitespaceValidator()],
    });

    constructor() {
        effect(() => {
            this.subtaskItems = this.initialSubtasks().map((subtask) => ({ ...subtask }));
        });
    }

    cancel() {
        this.subtaskEntry.reset();
    }
    requestReset() {
        this.cancel();
        this.subtaskItems = [];
        this.subtaskOutput.emit([]);
    }

    confirm() {
        if (
            !this.subtaskEntry.value ||
            this.subtaskEntry.value == '' ||
            this.subtaskEntry.hasError('whitespace') ||
            this.subtaskEntry.hasError('minlength')
        ) {
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
