import { Component, input, signal } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-button-priority',
    styleUrl: './button-priority.scss',
    templateUrl: './button-priority.html',
})
export class ButtonPriority {
    // readonly widthStr = input<string>('auto');
    // readonly small = input<boolean>(false);
    // readonly isDisabled = input<boolean>(false);
    // readonly buttonType = input<'button' | 'submit'>('button');
    isActive = signal<boolean>(false);
    readonly typeStr = input<string>('medPrio');

    btnSrc = new Map<string, string[]>([
        ['lowPrio', ['./assets/icons/low.svg', './assets/icons/low-white.svg', 'Low']],
        ['medPrio', ['./assets/icons/medium.svg', './assets/icons/medium-white.svg', 'Medium']],
        ['hiPrio', ['./assets/icons/urgent.svg', './assets/icons/urgent-white.svg', 'Urgent']],
    ]);

    toggleActiveState() {
        this.isActive.update((value) => !value);
    }
}
