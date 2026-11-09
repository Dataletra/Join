import { Component, inject, signal } from '@angular/core';
import { Event, Router, RouterLink, NavigationEnd } from '@angular/router';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Authentication } from '../../services/authentication';

@Component({
    imports: [RouterLink],
    selector: 'app-nav-bar',
    styleUrl: './nav-bar.scss',
    templateUrl: './nav-bar.html',
})
export class NavBar {
    navigateService = inject(TrackableNavigate);
    authService = inject(Authentication);
    private readonly router = inject(Router);
    private readonly activeUrl = signal<string>('');

    /**
     * Subscribes to router events and updates the active URL
     * whenever navigation to a new route has finished.
     * The subscription is automatically cleaned up when the component is destroyed.
     */
    constructor() {
        this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.activeUrl.set(event.url);
            }
        });
    }
}
