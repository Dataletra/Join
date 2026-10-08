import { Component, input } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-ic-contact',
    styleUrl: './ic-contact.scss',
    templateUrl: './ic-contact.html',
})
export class IcContact {
    readonly name = input.required<string>();
    initials: string = '';

    ngOnInit() {
        const words: string[] = this.name()
            .toUpperCase()
            .split(' ')
            .filter((word: string) => word !== '');
        this.initials = words[0].charAt(0) + words[words.length - 1].charAt(0);
    }
}
