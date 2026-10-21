import { Component, afterRenderEffect, computed, signal, viewChild } from '@angular/core';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
    imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, OverlayModule],
    selector: 'app-combobox-category',
    styleUrl: './combobox-category.scss',
    templateUrl: './combobox-category.html',
})
export class ComboboxCategory {
    readonly listbox = viewChild(Listbox);
    readonly selectedValues = signal<string[]>([]);
    readonly popupExpanded = signal(false);

    readonly displayIcon = computed(() => {
        const val = this.selectedValues()[0];
        const label = this.labels.find((label) => label.value === val);
        return label;
    });

    readonly displayValue = computed(() => this.selectedValues()[0] || 'Select a label');

    readonly labels = [{ value: 'Technical Task' }, { value: 'User Story' }];

    constructor() {
        afterRenderEffect(() => {
            this.listbox()?.scrollActiveItemIntoView();
        });
    }

    onCommit() {
        this.popupExpanded.set(false);
    }
}
