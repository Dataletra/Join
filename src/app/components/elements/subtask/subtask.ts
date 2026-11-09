import { Component, effect, inject, input, output, signal } from '@angular/core';
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
    duplicateExists = signal<boolean>(false);

    subtaskEntry = new FormControl('', {
        validators: [Validators.minLength(1), this.customValidator.containsOnlyWhitespaceValidator()],
    });

    /**
     * Initializes the local subtask list with copies of the subtasks received from the parent.
     * Runs again whenever the initial subtasks input changes.
     */
    constructor() {
        effect(() => {
            this.subtaskItems = this.initialSubtasks().map((subtask) => ({ ...subtask }));
        });
    }

    /**
     * Resets the subtask input and clears the duplicate warning.
     */
    cancel() {
        this.subtaskEntry.reset();
        this.duplicateExists.set(false);
    }

    /**
     * Resets the input and removes all subtasks from the local list.
     * Emits an empty array to the parent component.
     */
    requestReset() {
        this.cancel();
        this.subtaskItems = [];
        this.subtaskOutput.emit([]);
    }

    /**
     * Validates the entered subtask and checks for duplicates.
     * Saves the subtask if it is valid and either no duplicate exists
     * or the user explicitly confirms the override.
     * @param override - Whether an existing duplicate should be accepted.
     */
    confirm(override: boolean) {
        if (
            !this.subtaskEntry.value ||
            this.subtaskEntry.value == '' ||
            this.subtaskEntry.hasError('whitespace') ||
            this.subtaskEntry.hasError('minlength')
        ) {
            return;
        }
        if (this.duplicateExists()) {
            if (override) {
                this.saveSubtask();
            }
            return;
        }
        this.saveSubtask();
    }

    /**
     * Creates a new subtask with the entered title and adds it to the local list.
     * Resets the input and emits the updated list to the parent component.
     */
    saveSubtask() {
        const newSubtask: ISubtask = {
            title: this.subtaskEntry.value!,
            completed: false,
        };
        this.subtaskItems.push(newSubtask);
        this.subtaskEntry.reset();
        this.subtaskOutput.emit(this.subtaskItems);
        this.duplicateExists.set(false);
    }

    /**
     * Checks whether a subtask with the given title already exists.
     * Comparison ignores leading/trailing whitespace and letter casing.
     * @param title - The title to check for duplicates.
     */
    subtaskExists(title: string | null) {
        if (!title) {
            this.duplicateExists.set(false);
            return;
        }
        const normalizedTitle = title.trim().toLowerCase();
        this.duplicateExists.set(
            this.subtaskItems.some((subtask) => subtask.title.trim().toLowerCase() === normalizedTitle)
        );
    }

    /**
     * Switches a subtask from display mode to edit mode.
     * Enables and focuses the input field.
     * @param editCont - Container displaying the edit button.
     * @param saveCont - Container displaying the save button.
     * @param input - Input element containing the subtask title.
     */
    openEdit(editCont: HTMLElement, saveCont: HTMLElement, input: HTMLInputElement) {
        editCont.classList.add('d-none');
        saveCont.classList.remove('d-none');
        input.disabled = false;
        input.focus();
        input.closest('li')?.classList.add('editing');
    }

    /**
     * Saves the edited subtask title and switches back to display mode.
     * Emits the updated subtask list to the parent component.
     * @param index - Index of the subtask to update.
     * @param newTitle - New title of the subtask.
     * @param editCont - Container displaying the edit button.
     * @param saveCont - Container displaying the save button.
     * @param input - Input element containing the edited title.
     */
    saveEdit(index: number, newTitle: string, editCont: HTMLElement, saveCont: HTMLElement, input: HTMLInputElement) {
        this.subtaskItems[index].title = newTitle;
        saveCont.classList.add('d-none');
        editCont.classList.remove('d-none');
        input.disabled = true;
        input.closest('li')?.classList.remove('editing');
        this.subtaskOutput.emit(this.subtaskItems);
    }

    /**
     * Removes a subtask from the local list by its index.
     * Emits the updated list to the parent component.
     * @param index - Index of the subtask to delete.
     */
    delete(index: number) {
        this.subtaskItems.splice(index, 1);
        this.subtaskOutput.emit(this.subtaskItems);
    }
}
