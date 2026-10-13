import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar';
import { Header } from './components/header/header';
import { AddContact } from './components/content-contacts/add-contact/add-contact';
import { ToastAdded } from './components/elements/toast-added/toast-added';
@Component({
    imports: [RouterOutlet, NavBar, Header, AddContact, ToastAdded],
    selector: 'app-root',
    styleUrl: './app.scss',
    templateUrl: './app.html',
})
export class App {
    protected readonly title = signal('join');
}
