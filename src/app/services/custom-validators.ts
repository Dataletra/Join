import { inject, Service } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ContactService } from './contact-service';

@Service()
export class CustomValidators {
    contactService = inject(ContactService);

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

    customNameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }
            const pattern = /^[\p{L},'-]{2,}(?:[ ][\p{L},'-]{2,})+$/u;
            return pattern.test(value) ? null : { namePattern: true };
        };
    }

    customMailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }
            const pattern = /^[^\s@]{2,}@[^\s@]{2,}\.[^\s@]{2,}$/;
            return pattern.test(value) ? null : { emailPattern: true };
        };
    }

    customPhoneValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }
            const pattern = /^\+?[0-9\s()/-]+$/;
            const digitCount = value.replace(/\D/g, '').length;
            if (!pattern.test(value) || digitCount < 6) {
                return { phonePattern: true };
            }
            return null;
        };
    }

    customMailDbValidator(exception: null | (() => string | undefined) = null): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }
            return false === this.contactService.has('email', value) || (exception && exception() === value)
                ? null
                : { emailDbPattern: true };
        };
    }
}
