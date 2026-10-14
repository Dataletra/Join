import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { ButtonPrimary } from '../button-primary/button-primary';

@Component({
    imports: [ButtonPrimary],
    selector: 'app-popup-confirm',
    styleUrl: './popup-confirm.scss',
    templateUrl: './popup-confirm.html',
})
export class PopupConfirm {
    dialog = viewChild<ElementRef<HTMLDialogElement>>('popupConfirm');

    callbackDeny = input<() => void>(this.hide.bind(this));
    callbackOkay = input.required<() => void>();

    show = input.required<boolean>();
    done = output<boolean>();

    constructor() {
        effect(() => {
            this.toggleDialog();
        });
    }

    hide() {
        this.done.emit(true);
    }

    deny() {
        this.hide();
        this.callbackDeny()();
    }

    okay() {
        this.hide();
        this.callbackOkay()();
    }

    toggleDialog() {
        const dialogRef = this.dialog();
        if (!dialogRef) {
            return;
        }
        const element = dialogRef.nativeElement;
        if (this.show() && !element.open) {
            element.showModal();
        }
        if (!this.show() && element.open) {
            setTimeout(() => {
                element.close();
            }, 125);
        }
    }
}
