import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar';
import { AddContact } from './components/content-contacts/add-contact/add-contact';

@Component({
    imports: [RouterOutlet, NavBar, AddContact],
    selector: 'app-root',
    styleUrl: './app.scss',
    templateUrl: './app.html',
})
export class App {
    protected readonly title = signal('join');
}
