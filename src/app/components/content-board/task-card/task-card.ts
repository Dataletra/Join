import {
    Component,
    computed,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ITask } from '../../../interfaces/itask';
import { TaskLable } from '../../elements/task-lable/task-lable';
import { ContactService } from '../../../services/contact-service';
import { ContactDialog } from '../../../services/contact-dialog';
import { Menu, MenuItem, MenuTrigger, MenuContent } from '@angular/aria/menu';
import { Status } from '../../../interfaces/enums';
import { CdkConnectedOverlay, CdkOverlayOrigin, ScrollDispatcher } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

@Component({
    imports: [IcContact, TaskLable, Menu, MenuItem, MenuTrigger, CdkConnectedOverlay, CdkOverlayOrigin, MenuContent],
    selector: 'app-task-card',
    styleUrl: './task-card.scss',
    templateUrl: './task-card.html',
})
export class TaskCard {
    readonly task = input.required<ITask>();
    readonly taskClicked = output<ITask>();
    statusChange = output<{ id: number; status: Status }>();

    showMenu = signal<boolean>(false);
    overlayListen = signal<boolean>(false);

    private readonly Status = Status; // Make Status enum usable in HTML
    statusMenu = viewChild<Menu<string>>('statusMenu');

    contactService = inject(ContactService);
    dialogService = inject(ContactDialog);

    private scrollDispatcher = inject(ScrollDispatcher);
    private scrollSubscription?: Subscription;

    ngOnInit() {
        this.scrollSubscription = this.scrollDispatcher.scrolled().subscribe(() => {
            if (this.showMenu()) {
                this.hideMenu();
            }
        });
    }

    ngOnDestroy() {
        this.scrollSubscription?.unsubscribe();
    }

    assignedUsers = computed(() => {
        const userIds = this.task().user_ids;
        const users = this.contactService.users();
        return userIds.map((id) => users.find((user) => user.id === id)).filter((user) => user !== undefined);
    });

    onTaskClick() {
        this.dialogService.openTask('task', this.task());
    }

    get completedSubtasks(): number {
        return this.task().subtasks.filter((subtask) => subtask.completed).length;
    }

    get progress(): number {
        const total = this.task().subtasks.length;
        if (total === 0) {
            return 0;
        }
        return (this.completedSubtasks / total) * 100;
    }

    moveTo(status: Status) {
        this.statusChange.emit({ id: this.task().id, status: status });
    }

    toggleMenu(event: Event | null = null) {
        event?.stopPropagation();
        if (false === this.showMenu()) {
            this.overlayListen.set(true);
            this.showMenu.set(true);
        } else {
            this.showMenu.set(false);
            setTimeout(() => {
                this.overlayListen.set(false);
            }, 100);
        }
    }

    hideMenu(event: Event | null = null) {
        event?.stopPropagation();
        if (this.showMenu()) {
            this.showMenu.set(false);

            setTimeout(() => {
                this.overlayListen.set(false);
            }, 100);
        }
    }
}
