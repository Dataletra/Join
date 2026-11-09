import { Service, signal } from '@angular/core';
import { IUser } from '../interfaces/iuser';
import { Status } from '../interfaces/enums';
import { ITask } from '../interfaces/itask';

@Service()
export class ContactDialog {
    isOpen = signal(false);
    mode = signal<'add' | 'edit' | 'add-task' | 'task' | 'edit-task' | null>(null);
    selectedUser = signal<IUser | null>(null);
    progressType = signal<Status>(Status.todo);
    selectedTask = signal<ITask | null>(null);

    /**
     * Opens a dialog in the specified mode.
     * The dialog is only opened if no other dialog mode is currently active.
     *
     * @param mode - Dialog mode ('add', 'edit' or 'add-task').
     * @param user - Optional contact to be selected when opening the dialog.
     */
    open(mode: 'add' | 'edit' | 'add-task', user: IUser | null = null) {
        if (null === this.mode()) {
            this.mode.set(mode);
            this.selectedUser.set(user);
            this.isOpen.set(true);
        }
    }

    /**
     * Opens the task dialog and optionally assigns a selected task.
     *
     * @param mode - Task dialog mode.
     * @param task - Optional task to be displayed.
     */
    openTask(mode: 'task', task: ITask | null = null) {
        this.mode.set(mode);
        this.selectedTask.set(task);
        this.isOpen.set(true);
    }

    /** Opens the task dialog in edit mode. */
    openEditTask() {
        this.mode.set('edit-task');
        this.isOpen.set(true);
    }

    /** Switches the currently active dialog to edit-task mode. */
    switchToEditTask() {
        this.mode.set('edit-task');
    }

    /** Switches the currently active dialog to task view mode. */
    switchToTask() {
        this.mode.set('task');
    }

    /**
     * Closes the currently open dialog.
     * Clears the dialog mode and selected contact or task after a 300 ms delay
     * to allow the closing animation to finish.
     */
    close() {
        if (this.isOpen()) {
            this.isOpen.set(false);

            setTimeout(() => {
                this.mode.set(null);
                this.selectedUser.set(null);
                this.selectedTask.set(null);
            }, 300);
        }
    }

    /**
     * Sets the task progress status based on the provided string.
     * Defaults to the todo status if the provided value is invalid.
     *
     * @param type - Progress status ('todo', 'progress' or 'await').
     */
    setProgressType(type: string) {
        switch (type) {
            case 'todo':
                this.progressType.set(Status.todo);
                break;
            case 'progress':
                this.progressType.set(Status.progress);
                break;
            case 'await':
                this.progressType.set(Status.await);
                break;
            default:
                this.progressType.set(Status.todo);
                break;
        }
    }

    /**
     * Prevents an event from propagating to parent elements.
     *
     * @param event - The event whose propagation should be stopped.
     */
    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
