import { Service, signal } from '@angular/core';
import { IUser } from '../interfaces/iuser';
import { ITask } from '../interfaces/itask';

@Service()
export class ContactDialog {
    isOpen = signal(false);
    mode = signal<'add' | 'edit' | 'add-task' | 'task' | 'edit-task' | null>(null);
    selectedUser = signal<IUser | null>(null);
    selectedTask = signal<ITask | null>(null);

    open(mode: 'add' | 'edit' | 'add-task', user: IUser | null = null) {
        if (null === this.mode()) {
            this.mode.set(mode);
            this.selectedUser.set(user);
            this.isOpen.set(true);
        }
    }

    openTask(mode: 'task', task: ITask | null = null) {
        this.mode.set(mode);
        this.selectedTask.set(task);
        this.isOpen.set(true);
    }

    openEditTask() {
        this.mode.set('edit-task');
        this.isOpen.set(true);
    }

    switchToEditTask() {
        this.mode.set('edit-task');
    }

    switchToTask() {
        this.mode.set('task');
        console.log('switch to task');
    }

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

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
