import { Component, input, signal, computed, output } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-button-priority',
    styleUrl: './button-priority.scss',
    templateUrl: './button-priority.html',
})
export class ButtonPriority {
    lowIsActive = signal<boolean>(false);
    medIsActive = signal<boolean>(true);
    hiIsActive = signal<boolean>(false);
    prioSignals = [this.lowIsActive, this.medIsActive, this.hiIsActive];
    readonly existingPriority = input<string | null>();
    priorityOutput = output<string>();
    readonly useInEditTask = input<boolean>(false);

    btnSrc = new Map<string, string[]>([
        ['low', ['./assets/icons/low.svg', './assets/icons/low-white.svg', 'Low']],
        ['medium', ['./assets/icons/medium.svg', './assets/icons/medium-white.svg', 'Medium']],
        ['urgent', ['./assets/icons/urgent.svg', './assets/icons/urgent-white.svg', 'Urgent']],
    ]);

    ngOnInit() {
        const prio = this.existingPriority();
        if (prio != null) {
            this.toggleActiveState(prio!);
        } else {
            this.toggleActiveState('medium');
        }
    }

    toggleActiveState(prio: string) {
        this.prioSignals.forEach((btn) => {
            btn.set(false);
        });
        switch (prio) {
            case 'low':
                this.prioSignals[0].set(true);
                break;
            case 'medium':
                this.prioSignals[1].set(true);
                break;
            case 'urgent':
                this.prioSignals[2].set(true);
                break;
            default:
                console.error('PRIORITY BUTTON ERROR:' + prio);
        }
        this.priorityOutput.emit(prio);
    }
}
