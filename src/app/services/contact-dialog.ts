import { Service, signal } from '@angular/core';

@Service()
export class ContactDialog {
    isOpen = signal(false);
    mode = signal<'add' | 'edit' | null>(null);

    open(mode: 'add' | 'edit') {
        this.mode.set(mode);
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.mode.set(null);
    }
}
