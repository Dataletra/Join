import { Service, signal } from '@angular/core';
import { IUser } from '../interfaces/iuser';
import { Status } from '../interfaces/enums';

@Service()
export class ContactDialog {
    isOpen = signal(false);
    mode = signal<'add' | 'edit' | 'add-task' | null>(null);
    selectedUser = signal<IUser | null>(null);
    progressType = signal<Status>(Status.todo);

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
                console.error('Failiure setProgressType: ' + type);
                break;
        }
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
