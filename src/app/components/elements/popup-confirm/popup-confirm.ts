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

    /**
     * Register the toggleDialog() effect
     */
    constructor() {
        effect(() => {
            this.toggleDialog();
        });
    }

    /**
     * Hide this popup - emit output signal to tell parent component that we are done.
     */
    hide() {
        this.done.emit(true);
    }

    /**
     * Deny was pressed. Hide this popup and execute deny callback.
     */
    deny() {
        this.hide();
        this.callbackDeny()();
    }

    /**
     * Okay was pressed. Hide this popup and execute okay callback.
     */
    okay() {
        this.hide();
        this.callbackOkay()();
    }

    /**
     * Handle the click outside of the dialog
     * @param event {MouseEvent} - Mouse event for click.
     */
    onBackdropClick(event: MouseEvent) {
        const dialogElement = event.currentTarget as HTMLDialogElement;
        if (event.target === dialogElement) {
            this.deny();
        }
    }

    /**
     * Shor or hide the dialog.
     * @returns void
     */
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
