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
            if (!value) return null;
            const pattern = /^[\p{L}.'-]+(?: [\p{L}.'-]+)*$/u;
            return pattern.test(value) ? null : { namePattern: true };
        };
    }

    customFullNameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;
            return value.trim().split(/\s+/).length >= 2 ? null : { fullName: true };
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

    containsOnlyWhitespaceValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;
            const isOnlyWhitespace = /^\s+$/.test(value);
            return isOnlyWhitespace ? { whitespace: { value: control.value } } : null;
        };
    }

    customPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }
            const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,}$/;
            return pattern.test(value) ? null : { passwordPattern: true };
        };
    }

    customPasswordMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get('password')?.value;
            const confirmPassword = control.get('confirmPassword')?.value;

            if (!password || !confirmPassword) {
                return null;
            }

            return password === confirmPassword ? null : { passwordMismatch: true };
        };
    }
}
