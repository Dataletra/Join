import { Service, signal } from '@angular/core';

export enum ToastType {
    none,
    insertContact,
    updateContact,
    deleteContact,
    insertTask,
    updateTask,
    deleteTask,
    signedUp,
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
        [ToastType.signedUp, false],
    ]);

    /**
     * Register upcoming toast by specific type. E.g. we delete a task, register this event here, so on next 
     * channel update the toast will show.
     * @param type {ToastType} - type of toast to register
     */
    setTypeMatch(type: ToastType) {
        if (this.typeMatch.has(type)) {
            this.typeMatch.set(type, true);
        }
    }

    /**
     * Show toast display.
     */
    show() {
        this.isVisible.set(true);
    }

    /**
     * Hide toast display.
     */
    hide() {
        this.isVisible.set(false);
    }

    /**
     * Actually show toast with animation, if type was registered before (is true).
     * @param message {string} - message of the toast
     * @param type {ToastType} - type to check for match.
     */
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
