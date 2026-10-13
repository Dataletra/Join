import { Service, signal } from '@angular/core';

@Service()
export class Toast {
    isVisible = signal(false);

    show() {
        this.isVisible.set(true);
    }

    hide() {
        this.isVisible.set(false);
    }

    showToast() {
        this.show();
        setTimeout(() => {
            this.hide();
        }, 2000);
    }
}
