import { Component, input } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-button-primary',
    styleUrl: './button-primary.scss',
    templateUrl: './button-primary.html',
})
export class ButtonPrimary {
    readonly isLight = input<boolean>(false);
    readonly height = input<string>('56px');
}
