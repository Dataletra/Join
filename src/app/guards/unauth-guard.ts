import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/authentication';

export const unauthGuard: CanActivateFn = async (route, state) => {
    const authService = inject(Authentication);
    const router = inject(Router);
    await authService.isInitializing();
    return authService.isSignedIn() ? router.createUrlTree(['/summary']) : true;
};
