import { Component, inject, signal } from '@angular/core';
import { Event, Router, RouterLink, NavigationEnd } from '@angular/router';
import { TrackableNavigate } from '../../services/trackable-navigate';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
    imports: [RouterLink],
    selector: 'app-nav-bar',
    styleUrl: './nav-bar.scss',
    templateUrl: './nav-bar.html',
})
export class NavBar {
    navigateService = inject(TrackableNavigate);
    private readonly router = inject(Router);
    private readonly activeUrl = signal<string>('');

    constructor() {
        this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.activeUrl.set(event.url);
            }
        });
    }
}
