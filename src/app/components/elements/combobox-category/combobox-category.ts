import { Component, afterRenderEffect, computed, output, signal, viewChild } from '@angular/core';
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
    categoryOutput = output<string>();
    readonly popupExpanded = signal(false);

    readonly displayValue = computed(() => this.selectedValues()[0] || 'Select a Category');

    readonly labels = [{ value: 'Technical Task' }, { value: 'User Story' }];

    constructor() {
        afterRenderEffect(() => {
            this.listbox()?.scrollActiveItemIntoView();
        });
    }

    onCommit() {
        this.popupExpanded.set(false);
        this.categoryOutput.emit(this.selectedValues()[0]);
    }
}
