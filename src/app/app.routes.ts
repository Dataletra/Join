import { Routes } from '@angular/router';
import { ContentContacts } from './components/content-contacts/content-contacts';
import { ContentHelp } from './components/content-help/content-help';
import { ContentPrivacy } from './components/content-privacy/content-privacy';
import { ContentLegal } from './components/content-legal/content-legal';
import { ContentBoard } from './components/content-board/content-board';
import { ContentAddTask } from './components/content-add-task/content-add-task';
import { ContentSummary } from './components/content-summary/content-summary';
import { ContentMain } from './components/content-main/content-main';
import { LogIn } from './components/log-in/log-in';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LogIn,
        // TODO Guards
    },
    {
        path: '',
        component: ContentMain,
        children: [
            {
                path: 'summary',
                component: ContentSummary,
            },
            {
                path: 'add-task',
                component: ContentAddTask,
            },
            {
                path: 'board',
                component: ContentBoard,
            },
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
        ],
    },
    { path: '**', redirectTo: 'login' },
];
