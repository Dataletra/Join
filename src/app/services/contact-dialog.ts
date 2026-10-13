import { Service, signal } from '@angular/core';

@Service()
export class ContactDialog {
    isOpen = signal(false);

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
    }
}
