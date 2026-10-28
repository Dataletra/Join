import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TaskListService } from '../../services/tasklist-service';
import { TasksService } from '../../services/tasks-service';
import { TaskCard } from './task-card/task-card';
import { Status } from '../../interfaces/enums';
import { ITask } from '../../interfaces/itask';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDropList,
    moveItemInArray,
    transferArrayItem,
    CdkDragPlaceholder,
    CdkDragPreview,
    CdkDragMove,
} from '@angular/cdk/drag-drop';
import { Toast } from '../../services/toast';
import { ContactDialog } from '../../services/contact-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    imports: [ButtonPrimary, CdkDrag, CdkDropList, CdkDragPlaceholder, CdkDragPreview, TaskCard, CdkScrollable],
    selector: 'app-content-board',
    styleUrl: './content-board.scss',
    templateUrl: './content-board.html',
})
export class ContentBoard {
    lastX: number = 0;
    currentX: number = 0;
    currentY: number = 0;
    transX: number = 0;
    transY: number = 0;
    turn: number = 0;

    animationFrameId: number | null = null;
    isDragging: boolean = false;

    dialogService = inject(ContactDialog);
    sortingService = inject(TaskListService);
    taskService = inject(TasksService);
    toastService = inject(Toast);

    isFetchPending = signal<boolean>(true);
    notFound = signal<boolean>(false);
    searchResults = signal<number[] | null>(null);
    tasksToRender = computed(() => {
        const toFilter = this.searchResults();
        return toFilter ? this.sortingService.filter(toFilter) : this.sortingService.taskMap();
    });

    private readonly Status = Status; // Make Status enum usable in HTML

    delayDrag: number = window.matchMedia('(hover: hover)').matches ? 0 : 200;
    isTablet = signal<boolean>(window.matchMedia('(width <= 810px)').matches);
    isMobile = signal<boolean>(window.matchMedia('(width <= 560px)').matches);
    private readonly mediaEventTablet = window.matchMedia('(width <= 810px)');
    private readonly mediaEventMobile = window.matchMedia('(width <= 560px)');

    stickyWrapperHeight = signal<number | null>(1000);
    private readonly destroyRef = inject(DestroyRef);
    private readonly scrollWrapper = viewChild.required<ElementRef<HTMLElement>>('scrollWrapper');
    private readonly board = viewChild.required<ElementRef<HTMLElement>>('mainScrollable');

    constructor() {
        afterNextRender(() => {
            const el = this.scrollWrapper().nativeElement;
            this.stickyWrapperHeight.set(el.offsetHeight);

            const observer = new ResizeObserver(() => {
                this.stickyWrapperHeight.set(this.isMobile() ? el.offsetHeight : null);
            });
            observer.observe(el);

            this.destroyRef.onDestroy(() => observer.disconnect());
        });
    }

    onMediaChangeTablet = (event: MediaQueryListEvent): void => {
        this.isTablet.set(event.matches);
    };
    onMediaChangeMobile = (event: MediaQueryListEvent): void => {
        this.isMobile.set(event.matches);
    };

    async ngOnInit() {
        this.fetchTaskLists();
        this.mediaEventTablet.addEventListener('change', this.onMediaChangeTablet);
        this.mediaEventMobile.addEventListener('change', this.onMediaChangeMobile);
    }

    ngOnDestroy() {
        this.mediaEventTablet.removeEventListener('change', this.onMediaChangeTablet);
        this.mediaEventMobile.addEventListener('change', this.onMediaChangeMobile);
    }

    async fetchTaskLists() {
        await this.sortingService.getTaskLists();
        await this.taskService.getTasks();
        this.syncTasksWithTaskMap();
        this.isFetchPending.set(false);
    }

    syncTasksWithTaskMap() {
        const allTasks: number[] = [];
        const deleteMap = new Map<Status, number[]>();
        for (const task of this.taskService.tasklist()) {
            this.findDirtyTasks(task, deleteMap);
            allTasks.push(task.id);
        }
        this.findDeprecatedTasks(allTasks, deleteMap);
        const updatedMap = this.createCleanTaskMap(allTasks, deleteMap);
        this.sortingService.editTaskMap(updatedMap);
    }

    findDirtyTasks(task: ITask, deleteMap: Map<Status, number[]>) {
        for (const [status, taskList] of this.sortingService.taskMap()) {
            const index = taskList.indexOf(task.id);
            if (index >= 0 && status !== task.status) {
                const ids = deleteMap.get(task.status) ?? [];
                deleteMap.set(status, [...ids, task.id]);
            }
        }
    }

    findDeprecatedTasks(allTasks: number[], deleteMap: Map<Status, number[]>) {
        for (const [status, taskList] of this.sortingService.taskMap()) {
            const deprecated = taskList.filter((id) => false === allTasks.includes(id));

            deprecated.forEach((id) => {
                const ids = deleteMap.get(status) ?? [];
                deleteMap.set(status, [...ids, id]);
            });
        }
    }

    createCleanTaskMap(allTasks: number[], deleteMap: Map<Status, number[]>) {
        const updatedMap = new Map(this.sortingService.taskMap());
        for (const [status, taskList] of deleteMap) {
            const ids = updatedMap.get(status) ?? [];
            updatedMap.set(
                status,
                ids.filter((id) => false === taskList.includes(id))
            );
        }
        for (const newId of allTasks) {
            const newTask = this.taskService.tasklist().find((element) => element.id === newId);
            if (newTask && (updatedMap.get(newTask.status)?.indexOf(newId) ?? 0) < 0) {
                updatedMap.get(newTask.status)?.push(newTask.id);
            }
        }
        return updatedMap;
    }

    drop(event: CdkDragDrop<Status>) {
        const statusPre = event.previousContainer.data;
        const statusNow = event.container.data;
        const dataRefNow = this.sortingService.taskMap().get(statusNow) ?? [];

        if (event.previousContainer === event.container) {
            if (this.sortingService.taskMap().has(statusNow) && event.previousIndex !== event.currentIndex) {
                moveItemInArray(dataRefNow, event.previousIndex, event.currentIndex);
                this.sortingService.editTaskList({ status: statusNow, order: dataRefNow });
            }
        } else if (this.sortingService.taskMap().has(statusPre) && this.sortingService.taskMap().has(statusNow)) {
            const dataRefPre = this.sortingService.taskMap().get(statusPre) ?? [];
            transferArrayItem(dataRefPre, dataRefNow, event.previousIndex, event.currentIndex);
            this.sortingService.editTaskList({ status: statusPre, order: dataRefPre });
            this.sortingService.editTaskList({ status: statusNow, order: dataRefNow });
            this.taskService.editStatus(dataRefNow.at(event.currentIndex), statusNow);
        }
        this.stopVerticalAutoScroll();
    }

    setRelativeMousePosition(event: MouseEvent): void {
        const element = event.currentTarget as HTMLElement;
        const rect = element.getBoundingClientRect();
        this.lastX = 0;
        this.transX = event.clientX - rect.left;
        this.transY = event.clientY - rect.top;
    }

    onDrageMove(event: CdkDragMove): void {
        this.lastX = this.lastX == 0 ? event.pointerPosition.x : this.lastX;
        this.rotateCard(event);
        this.scrollOnMove(event);
    }

    rotateCard(event: CdkDragMove): void {
        const pointer = event.pointerPosition;
        this.turn = Math.min(5, Math.max(-5, (-1 * (this.lastX - pointer.x)) / 10));
    }

    applyFilter(searchkey: string, showToast: boolean = false) {
        this.searchResults.set(searchkey ? this.taskService.findString(searchkey) : null);
        if (0 === this.searchResults()?.length && showToast) {
            this.toastService.showToast('No results found.');
            this.notFound.set(true);
        } else {
            this.notFound.set(false);
        }
    }

    resetColor(event: KeyboardEvent | null = null) {
        if (null === event || event.key !== 'Enter') {
            this.notFound.set(false);
        }
    }
onEnter() {
    console.log("ente");
}
    private scrollOnMove(event: CdkDragMove): void {
        this.currentX = event.pointerPosition.x;
        this.currentY = event.pointerPosition.y;
        this.isDragging = true;
        if (this.animationFrameId === null) {
            this.animationFrameId = requestAnimationFrame(() => this.autoScroll());
        }
    }

    private autoScroll(): void {
        this.animationFrameId = null;
        if (!this.isDragging) {
            return;
        }
        const elementY = this.board().nativeElement;
        const elementX = this.scrollWrapper().nativeElement;
        const rectX = elementX.getBoundingClientRect();
        const rectY = elementY.getBoundingClientRect();
        elementX.scrollLeft += rectX.left + 80 > this.currentX ? -20 : rectX.right - 80 < this.currentX ? 20 : 0;
        elementY.scrollTop += rectY.top + 80 > this.currentY ? -20 : rectY.bottom - 80 < this.currentY ? 20 : 0;

        this.animationFrameId = requestAnimationFrame(() => this.autoScroll());
    }

    private stopVerticalAutoScroll(): void {
        this.isDragging = false;

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
