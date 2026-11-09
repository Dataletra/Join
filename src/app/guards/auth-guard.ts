import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/authentication';

/**
 * Check if we can activate given route, because we are logged in.
 * @param route - route used by app.routes.ts
 * @param state - state used by app.routes.ts
 * @returns true if route can be activated, else navigate to login
 */
export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(Authentication);
    const router = inject(Router);
    await authService.isInitializing();
    return authService.isSignedIn() ? true : router.createUrlTree(['/login']);
};
