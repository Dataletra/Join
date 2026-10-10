import { Routes } from '@angular/router';
import { ContentContacts } from './components/content-contacts/content-contacts';
import { ContentHelp } from './components/content-help/content-help';
import { ContentPrivacy } from './components/content-privacy/content-privacy';
import { ContentLegal } from './components/content-legal/content-legal';

export const routes: Routes = [
    {
        path: 'contacts',
        component: ContentContacts,
    },
    {
        path: 'help',
        component: ContentHelp,
    },
    {
        path: 'privacy-policy',
        component: ContentPrivacy,
    },
    {
        path: 'legal-notice',
        component: ContentLegal,
    },
];
