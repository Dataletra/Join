import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar';
import { Header } from './components/header/header';
import { ToastAdded } from './components/elements/toast-added/toast-added';
import { AddContact } from './components/content-contacts/add-contact/add-contact';
import { EditContact } from './components/content-contacts/edit-contact/edit-contact';
import { AddTask } from './components/content-board/add-task/add-task';
import { DetailView } from './components/content-board/detail-view/detail-view';
import { EditTask } from './components/content-board/edit-task/edit-task';

@Component({
    imports: [RouterOutlet, NavBar, Header, ToastAdded, AddContact, EditContact, AddTask, DetailView, EditTask],
    selector: 'app-root',
    styleUrl: './app.scss',
    templateUrl: './app.html',
})
export class App {
    protected readonly title = signal('join');
}
