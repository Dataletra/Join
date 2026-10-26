import { Service } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Service()
export class CustomValidators {
    dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (control?.value) {
            const today = new Date();
            const dateToCheck = new Date(control.value);
            dateToCheck.setHours(23, 59, 59, 59);
            if (dateToCheck < today) {
                return { 'date in past': true };
            }
        }
        return null;
    }
}
