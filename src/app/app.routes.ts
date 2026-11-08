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
import { authGuard } from './guards/auth-guard';
import { unauthGuard } from './guards/unauth-guard';
import { SignUp } from './components/sign-up/sign-up';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LogIn,
        canActivate: [unauthGuard],
    },
    {
        path: 'sign-up',
        component: SignUp,
        canActivate: [unauthGuard],
    },
    {
        path: '',
        component: ContentMain,
        children: [
            {
                path: 'summary',
                component: ContentSummary,
                canActivate: [authGuard],
            },
            {
                path: 'add-task',
                component: ContentAddTask,
                canActivate: [authGuard],
            },
            {
                path: 'board',
                component: ContentBoard,
                canActivate: [authGuard],
            },
            {
                path: 'contacts',
                component: ContentContacts,
                canActivate: [authGuard],
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
