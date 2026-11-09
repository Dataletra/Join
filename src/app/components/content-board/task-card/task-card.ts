import {
    afterNextRender,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { IcContact } from '../../elements/ic-contact/ic-contact';
import { ITask } from '../../../interfaces/itask';
import { Tasklabel } from '../../elements/task-label/task-label';
import { ContactService } from '../../../services/contact-service';
import { ContactDialog } from '../../../services/contact-dialog';
import { Menu, MenuItem, MenuTrigger, MenuContent } from '@angular/aria/menu';
import { Status } from '../../../interfaces/enums';
import { CdkConnectedOverlay, CdkOverlayOrigin, ScrollDispatcher } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

@Component({
    imports: [IcContact, Tasklabel, Menu, MenuItem, MenuTrigger, CdkConnectedOverlay, CdkOverlayOrigin, MenuContent],
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
    isTight = signal<boolean>(false);
    flipMenu = signal<boolean>(false);

    private readonly Status = Status; // Make Status enum usable in HTML
    statusMenu = viewChild<Menu<string>>('statusMenu');
    private readonly taskCard = viewChild.required<ElementRef<HTMLElement>>('taskCard');

    contactService = inject(ContactService);
    dialogService = inject(ContactDialog);
    private readonly destroyRef = inject(DestroyRef);

    private scrollDispatcher = inject(ScrollDispatcher);
    private scrollSubscription?: Subscription;

    /**
     * Initializes a ResizeObserver to monitor the task card's width.
     * Updates isTight when the card becomes narrower than 140 pixels.
     * Disconnects the observer when the component is destroyed.
     */
    constructor() {
        afterNextRender(() => {
            const el = this.taskCard().nativeElement;
            const observer = new ResizeObserver(() => {
                this.isTight.set(el.offsetWidth < 140);
            });
            observer.observe(el);
            this.destroyRef.onDestroy(() => {
                observer.disconnect();
            });
        });
    }

    /**
     * Subscribes to scrolling events.
     * Closes the context menu whenever the user scrolls while it is open.
     */
    ngOnInit() {
        this.scrollSubscription = this.scrollDispatcher.scrolled().subscribe(() => {
            if (this.showMenu()) {
                this.hideMenu();
            }
        });
    }

    /**
     * Unsubscribes from scrolling events when the component is destroyed.
     */
    ngOnDestroy() {
        this.scrollSubscription?.unsubscribe();
    }

    /**
     * Returns the contact objects assigned to the current task.
     * Resolves the user IDs stored in the task against the contact list.
     */
    assignedUsers = computed(() => {
        const userIds = this.task().user_ids;
        const users = this.contactService.users();
        return userIds.map((id) => users.find((user) => user.id === id)).filter((user) => user !== undefined);
    });

    /**
     * Opens the task detail dialog for the current task.
     */
    onTaskClick() {
        this.dialogService.openTask('task', this.task());
    }

    /**
     * Returns the number of completed subtasks.
     */
    get completedSubtasks(): number {
        return this.task().subtasks.filter((subtask) => subtask.completed).length;
    }

    /**
     * Calculates the completion percentage of the task's subtasks.
     * Returns 0 if the task has no subtasks.
     */
    get progress(): number {
        const total = this.task().subtasks.length;
        if (total === 0) {
            return 0;
        }
        return (this.completedSubtasks / total) * 100;
    }

    /**
     * Emits a status change for the current task.
     * @param status - The new status to assign to the task.
     */
    moveTo(status: Status) {
        this.statusChange.emit({ id: this.task().id, status: status });
    }

    /**
     * Toggles the context menu and updates the overlay state.
     * Calculates the menu position before opening it.
     * @param event - Optional event whose propagation should be stopped.
     */
    toggleMenu(event: Event | null = null) {
        event?.stopPropagation();
        if (false === this.showMenu()) {
            this.setMenuPosition();
            this.overlayListen.set(true);
            this.showMenu.set(true);
        } else {
            this.showMenu.set(false);
            setTimeout(() => {
                this.overlayListen.set(false);
            }, 100);
        }
    }

    /**
     * Closes the context menu and disables overlay listening after a short delay.
     * @param event - Optional event whose propagation should be stopped.
     */
    hideMenu(event: Event | null = null) {
        event?.stopPropagation();
        if (this.showMenu()) {
            this.showMenu.set(false);

            setTimeout(() => {
                this.overlayListen.set(false);
            }, 100);
        }
    }

    /**
     * Determines whether the context menu needs to be flipped
     * based on the task card's position within the viewport.
     * Flips the menu if there is not enough space on the right.
     */
    setMenuPosition() {
        const rectRelative = this.taskCard().nativeElement.getBoundingClientRect();
        this.flipMenu.set(rectRelative.right < 200 + 12);
    }
}
