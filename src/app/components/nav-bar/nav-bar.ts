import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackableNavigate } from '../../services/trackable-navigate';

@Component({
    imports: [RouterLink],
    selector: 'app-nav-bar',
    styleUrl: './nav-bar.scss',
    templateUrl: './nav-bar.html',
})
export class NavBar {
    navigateService = inject(TrackableNavigate);
}
