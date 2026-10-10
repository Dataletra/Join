import { Routes } from '@angular/router';
import { ContentContacts } from './components/content-contacts/content-contacts';
import { ContentHelp } from './components/content-help/content-help';
import { ContentPrivacy } from './components/content-privacy/content-privacy';
import { ContentLegal } from './components/content-legal/content-legal';
import { ContentArticle } from './components/content-article/content-article';

export const routes: Routes = [
    {
        path: 'contacts',
        component: ContentContacts,
    },
    {
        path: 'help',
        component: ContentArticle,
    },
    {
        path: 'privacy-policy',
        component: ContentArticle,
    },
    {
        path: 'legal-notice',
        component: ContentArticle,
    },
];
