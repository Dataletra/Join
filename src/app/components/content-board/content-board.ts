import { Component, inject } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TaskListService } from '../../services/tasklist-service';
import { TasksService } from '../../services/tasks-service';
import { TaskCard } from './task-card/task-card';
import { Status } from '../../interfaces/status';
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

@Component({
    imports: [ButtonPrimary, CdkDrag, CdkDropList, CdkDragPlaceholder, CdkDragPreview, TaskCard],
    selector: 'app-content-board',
    styleUrl: './content-board.scss',
    templateUrl: './content-board.html',
})
export class ContentBoard {
    lastX: number = 0;
    transX: number = 0;
    transY: number = 0;
    turn: number = 0;

    sortingService = inject(TaskListService);
    taskService = inject(TasksService);

    private readonly Status = Status; // Make Status enum usable in HTML

    delayDrag: number = window.matchMedia('(hover: hover)').matches ? 0 : 200;

    async ngOnInit() {
        this.fetchTaskLists();
    }

    async fetchTaskLists() {
        await this.sortingService.getTaskLists();
        await this.taskService.getTasks();
        this.syncTasksWithTaskMap();
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
    }

    setRelativeMousePosition(event: MouseEvent): void {
        const element = event.currentTarget as HTMLElement;
        const rect = element.getBoundingClientRect();
        this.lastX = 0;
        this.transX = event.clientX - rect.left;
        this.transY = event.clientY - rect.top;
    }

    rotateByMovement(event: CdkDragMove): void {
        const pointer = event.pointerPosition;
        this.lastX = this.lastX == 0 ? pointer.x : this.lastX;
        this.turn = Math.min(5, Math.max(-5, (-1 * (this.lastX - pointer.x)) / 10));
    }
}
