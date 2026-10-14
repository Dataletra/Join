import { Component, input, output, signal } from '@angular/core';
import { ButtonPrimary } from '../button-primary/button-primary';

@Component({
    imports: [ButtonPrimary],
    selector: 'app-popup-confirm',
    styleUrl: './popup-confirm.scss',
    templateUrl: './popup-confirm.html',
})
export class PopupConfirm {
    callbackDeny = input<() => void>(this.hide.bind(this));
    callbackOkay = input.required<() => void>();

    show = input.required<boolean>();
    done = output<boolean>();

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
}
