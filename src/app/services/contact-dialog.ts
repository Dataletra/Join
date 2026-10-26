import { Service, signal } from '@angular/core';
import { IUser } from '../interfaces/iuser';

@Service()
export class ContactDialog {
    isOpen = signal(false);
    mode = signal<'add' | 'edit' | 'add-task' | null>(null);
    selectedUser = signal<IUser | null>(null);

    open(mode: 'add' | 'edit' | 'add-task', user: IUser | null = null) {
        if (null === this.mode()) {
            this.mode.set(mode);
            this.selectedUser.set(user);
            this.isOpen.set(true);
        }
    }

    close() {
        if (this.isOpen()) {
            this.isOpen.set(false);

            setTimeout(() => {
                this.mode.set(null);
                this.selectedUser.set(null);
            }, 300);
        }
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
