import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar';
import { Header } from './components/header/header';
import { ToastAdded } from './components/elements/toast-added/toast-added';

@Component({
    imports: [RouterOutlet, NavBar, Header, ToastAdded],
    selector: 'app-root',
    styleUrl: './app.scss',
    templateUrl: './app.html',
})
export class App {
    protected readonly title = signal('join');
}
