import { Component } from '@angular/core';
import { IcContact } from '../elements/ic-contact/ic-contact';

@Component({
  imports: [IcContact],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {}
