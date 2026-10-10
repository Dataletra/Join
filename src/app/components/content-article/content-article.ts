import { Component, inject } from '@angular/core';
import { ContentHelp } from '../content-help/content-help';
import { ContentLegal } from '../content-legal/content-legal';
import { ContentPrivacy } from '../content-privacy/content-privacy';
import { Router } from '@angular/router';

@Component({
    imports: [ContentHelp, ContentLegal, ContentPrivacy],
    selector: 'app-content-article',
    styleUrl: './content-article.scss',
    templateUrl: './content-article.html',
})
export class ContentArticle {
    contentStr: string | null = '';
    router = inject(Router);

    ngOnInit() {
        this.contentStr = this.router.url;
        console.log(this.contentStr);
    }
}
