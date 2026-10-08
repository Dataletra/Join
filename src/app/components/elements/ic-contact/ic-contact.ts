import { Component, input } from '@angular/core';
const iconColors = [
    '#ff7a00',
    '#9327ff',
    '#ff745e',
    '#ffc701',
    '#ff5eb3',
    '#00bee8',
    '#ffa35e',
    '#0038ff',
    '#ff4646',
    '#6e52ff',
    '#1fd7c1',
    '#fc71ff',
    '#ffbb2b',
];
@Component({
    imports: [],
    selector: 'app-ic-contact',
    styleUrl: './ic-contact.scss',
    templateUrl: './ic-contact.html',
})
export class IcContact {
    readonly name = input.required<string>();
    initials: string = '';
    colorStr: string = '';

    ngOnInit() {
        const words: string[] = this.name()
            .toUpperCase()
            .split(' ')
            .filter((word: string) => word !== '');
        this.initials = words[0].charAt(0) + words[words.length - 1].charAt(0);
        this.colorStr = iconColors[this.getColorIndex(this.name())];
    }

    getColorIndex(fullname: string) {
        let hash = 0;
        for (const char of fullname) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0;
        }
        return Math.abs(hash) % iconColors.length;
    }
}
