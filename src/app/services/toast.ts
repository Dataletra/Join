import { Service, signal } from '@angular/core';

export enum ToastType {
    none,
    insertContact,
    updateContact,
    deleteContact,
    insertTask,
    updateTask,
    deleteTask,
}

@Service()
export class Toast {
    isVisible = signal(false);
    message = signal('');

    typeMatch: Map<ToastType, boolean> = new Map<ToastType, boolean>([
        [ToastType.none, true],
        [ToastType.insertContact, false],
        [ToastType.updateContact, false],
        [ToastType.deleteContact, false],
        [ToastType.insertTask, false],
        [ToastType.updateTask, false],
        [ToastType.deleteTask, false],
    ]);

    setTypeMatch(type: ToastType) {
        if (this.typeMatch.has(type)) {
            this.typeMatch.set(type, true);
        }
    }

    show() {
        this.isVisible.set(true);
    }

    hide() {
        this.isVisible.set(false);
    }

    showToast(message: string, type: ToastType = ToastType.none) {
        if (this.typeMatch.get(type)) {
            this.message.set(message);
            this.show();
            setTimeout(() => {
                this.hide();
            }, 2000);
            this.typeMatch.set(type, type === ToastType.none);
        }
    }
}
