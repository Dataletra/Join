import { Component, computed, input } from '@angular/core';
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
    readonly enableShadow = input<boolean>(false);
    readonly isHeader = input<boolean>(false);
    readonly isDummy = input<boolean>(false);

    /**
     * Compute up to two initials letters when name changes. It is first letter of first and (if existing) second name.
     */
    initials = computed(() => {
        const words: string[] = this.name()
            .toUpperCase()
            .split(' ')
            .filter((word: string) => word !== '');
        return words.length > 1 ? words[0].charAt(0) + words[words.length - 1].charAt(0) : (words[0]?.charAt(0) ?? '');
    });

    /**
     * Set icon collor based on hash from name string.
     */
    colorStr = computed(() => {
        return iconColors[this.getColorIndex(this.name())];
    });

    /**
     * Calculate a simple hash based on the full name string and quantize to the index of possible colors.
     * @param fullname {string} - Full name string.
     * @returns {number} -  index of iconColors to be used
     */
    getColorIndex(fullname: string) {
        let hash = 0;
        for (const char of fullname) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0;
        }
        return Math.abs(hash) % iconColors.length;
    }
}
