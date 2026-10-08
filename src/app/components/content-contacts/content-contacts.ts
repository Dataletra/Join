import { Component } from '@angular/core';
import { IcContact } from '../elements/ic-contact/ic-contact';

@Component({
  imports: [IcContact],
  selector: 'app-content-contacts',
  styleUrl: './content-contacts.scss',
  templateUrl: './content-contacts.html',
})
export class ContentContacts {}
