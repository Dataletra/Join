import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastAdded } from './components/elements/toast-added/toast-added';

@Component({
    imports: [RouterOutlet, ToastAdded],
    selector: 'app-root',
    styleUrl: './app.scss',
    templateUrl: './app.html',
})
export class App {
    protected readonly title = signal('join');
}
