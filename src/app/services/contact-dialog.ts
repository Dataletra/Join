import { Service, signal } from '@angular/core';
import { IUser } from '../interfaces/iuser';
import { ITask } from '../interfaces/itask';

@Service()
export class ContactDialog {
    isOpen = signal(false);
    mode = signal<'add' | 'edit' | 'task' | 'edit-task' | null>(null);
    selectedUser = signal<IUser | null>(null);
    selectedTask = signal<ITask | null>(null);

    openContact(mode: 'add' | 'edit', user: IUser | null = null) {
        this.mode.set(mode);
        this.selectedUser.set(user);
        this.isOpen.set(true);
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

    close() {
        this.isOpen.set(false);
        this.mode.set(null);
        this.selectedUser.set(null);
        this.selectedTask.set(null);
    }
}

// TODO Delete Me

// export class ContactDialog {
//     isOpen = signal(false);
//     mode = signal<'add' | 'edit' | null>(null);
//     selectedUser = signal<IUser | null>(null);

//     open(mode: 'add' | 'edit', user: IUser | null = null) {
//         this.mode.set(mode);
//         this.selectedUser.set(user);
//         this.isOpen.set(true);
//     }

//     close() {
//         this.isOpen.set(false);
//         this.mode.set(null);
//         this.selectedUser.set(null);
//     }
// }
