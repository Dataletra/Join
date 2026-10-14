import { Service, signal } from '@angular/core';

@Service()
export class Toast {
    isVisible = signal(false);
    message = signal('');

    show() {
        this.isVisible.set(true);
    }

    hide() {
        this.isVisible.set(false);
    }

    showToast(message: string) {
        this.message.set(message);
        this.show();
        setTimeout(() => {
            this.hide();
        }, 2000);
    }
}
