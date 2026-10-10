import { Routes } from '@angular/router';
import { ContentContacts } from './components/content-contacts/content-contacts';
import { ContentHelp } from './components/content-help/content-help';

export const routes: Routes = [
    {
        path: 'contacts',
        component: ContentContacts,
    },
    {
        path: 'help',
        component: ContentHelp,
    },
];
