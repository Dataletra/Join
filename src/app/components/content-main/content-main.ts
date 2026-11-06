import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from '../nav-bar/nav-bar';
import { Header } from '../header/header';
import { ToastAdded } from '../elements/toast-added/toast-added';
import { AddContact } from '../content-contacts/add-contact/add-contact';
import { EditContact } from '../content-contacts/edit-contact/edit-contact';
import { AddTask } from '../content-board/add-task/add-task';
import { DetailView } from '../content-board/detail-view/detail-view';
import { EditTask } from '../content-board/edit-task/edit-task';


@Component({
  imports: [RouterOutlet, NavBar, Header, ToastAdded, AddContact, EditContact, AddTask, DetailView, EditTask],
  selector: 'app-content-main',
  styleUrl: './content-main.scss',
  templateUrl: './content-main.html',
})
export class ContentMain {}
