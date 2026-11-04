import { Service, inject } from '@angular/core';
import { Router } from '@angular/router';

@Service()
export class TrackableNavigate {
    private router = inject(Router);

    /**
     * Navigate router to given path.
     * @param path {string} - router navigation path, e.g. 'legal-notice'
     */
    goTo(path: string) {
        this.router.navigate([path], { state: { originUrl: this.router.url } });
    }

    /**
     * Navigate back to previous path.
     */
    goBack() {
        const origin = history.state.originUrl as string | undefined;
        this.router.navigate([origin ?? '']);
    }
}
