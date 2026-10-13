import { Service, inject } from '@angular/core';
import { Router } from '@angular/router';

@Service()
export class TrackableNavigate {
    private router = inject(Router);

    goTo(path: string) {
        this.router.navigate([path], { state: { originUrl: this.router.url } });
    }

    goBack() {
        const origin = history.state.originUrl as string | undefined;
        this.router.navigate([origin ?? '']);
    }
}
