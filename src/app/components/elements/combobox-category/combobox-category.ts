import { Component, afterRenderEffect, computed, output, signal, viewChild } from '@angular/core';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
    imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, OverlayModule],
    selector: 'app-combobox-category',
    styleUrl: './combobox-category.scss',
    templateUrl: './combobox-category.html',
    host: {
        '(click)': 'markAsTouched()',
    },
})
export class ComboboxCategory {
    readonly listbox = viewChild(Listbox);
    readonly selectedValues = signal<string[]>([]);
    categoryOutput = output<string>();
    readonly popupExpanded = signal(false);
    touched = output<void>();
    private hasBeenTouched = false;
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
        this.touched.emit();
    }
    onOpenOrClose(expanded: boolean) {
        this.popupExpanded.set(expanded);
        if (!expanded) {
            this.touched.emit();
        }
    }
    markAsTouched() {
        if (!this.hasBeenTouched) {
            this.hasBeenTouched = true;
            this.touched.emit(); // Emits once on first interaction
        }
    }
}
