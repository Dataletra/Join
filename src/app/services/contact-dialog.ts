import { Service, signal } from '@angular/core';
import { IUser } from '../interfaces/iuser';

@Service()
export class ContactDialog {
    isOpen = signal(false);
    mode = signal<'add' | 'edit' | 'add-task' | null>(null);
    selectedUser = signal<IUser | null>(null);

    open(mode: 'add' | 'edit' | 'add-task', user: IUser | null = null) {
        this.mode.set(mode);
        this.selectedUser.set(user);
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.mode.set(null);
        this.selectedUser.set(null);
    }
}
