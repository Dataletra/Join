import { Component, inject } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TaskListService } from '../../services/tasklist-service';
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
    imports: [ButtonPrimary, CdkDrag, CdkDropList, CdkDragPlaceholder, CdkDragPreview],
    selector: 'app-content-board',
    styleUrl: './content-board.scss',
    templateUrl: './content-board.html',
})
export class ContentBoard {
    lastX: number = 0;
    transX: number = 0;
    transY: number = 0;
    turn: number = 0;

    taskListService = inject(TaskListService);
    private readonly Status = Status; // Make Status enum usable in HTML
    delayDrag: number = window.matchMedia('(hover: hover)').matches ? 0 : 200;

    async ngOnInit() {
        this.fetchTaskLists();
    }

    async fetchTaskLists() {
        await this.taskListService.getTaskLists();

        // TODO: testcode
        console.log(this.tasks);
        this.createSomeTasks();

        this.syncTasksWithTaskMap();
    }

    syncTasksWithTaskMap() {
        const insertQueue: number[] = [];
        const deleteMap = new Map<Status, number[]>();
        const allTasks: number[] = [];
        for (const task of this.tasks) {
            const found = this.findDirtyTasks(task, deleteMap);
            if (false === found) {
                insertQueue.push(task.id);
            }
            allTasks.push(task.id);
        }
        this.findDeprecatedTasks(allTasks, deleteMap);
        const updatedMap = this.createCleanTaskMap(insertQueue, deleteMap);
        this.taskListService.editTaskMap(updatedMap);
    }

    findDirtyTasks(task: ITask, deleteMap: Map<Status, number[]>) {
        let found = false;
        for (const [status, taskList] of this.taskListService.taskMap()) {
            const index = taskList.indexOf(task.id);
            if (index >= 0 && status !== task.status) {
                const ids = deleteMap.get(task.status) ?? [];
                deleteMap.set(status, [...ids, task.id]);
                found = true;
            } else if (index >= 0) {
                found = true;
            }
        }
        return found;
    }

    findDeprecatedTasks(allTasks: number[], deleteMap: Map<Status, number[]>) {
        for (const [status, taskList] of this.taskListService.taskMap()) {
            const deprecated = taskList.filter((id) => false === allTasks.includes(id));

            deprecated.forEach((id) => {
                const ids = deleteMap.get(status) ?? [];
                deleteMap.set(status, [...ids, id]);
            });
        }
    }

    createCleanTaskMap(insertQueue: number[], deleteMap: Map<Status, number[]>) {
        const updatedMap = new Map(this.taskListService.taskMap());
        for (const [status, taskList] of deleteMap) {
            const ids = updatedMap.get(status) ?? [];
            updatedMap.set(
                status,
                ids.filter((id) => false === taskList.includes(id))
            );
        }
        for (const newId of insertQueue) {
            const newTask = this.tasks.find((element) => element.id === newId);
            if (newTask) {
                updatedMap.get(newTask.status)?.push(newTask.id);
            }
        }
        return updatedMap;
    }

    drop(event: CdkDragDrop<Status>) {
        const statusPre = event.previousContainer.data;
        const statusNow = event.container.data;
        const dataRefNow = this.taskListService.taskMap().get(statusNow) ?? [];

        if (event.previousContainer === event.container) {
            if (this.taskListService.taskMap().has(statusNow) && event.previousIndex !== event.currentIndex) {
                moveItemInArray(dataRefNow, event.previousIndex, event.currentIndex);
                this.taskListService.editTaskList({ status: statusNow, order: dataRefNow });
            }
        } else if (this.taskListService.taskMap().has(statusPre) && this.taskListService.taskMap().has(statusNow)) {
            const dataRefPre = this.taskListService.taskMap().get(statusPre) ?? [];
            transferArrayItem(dataRefPre, dataRefNow, event.previousIndex, event.currentIndex);
            this.taskListService.editTaskList({ status: statusPre, order: dataRefPre });
            this.taskListService.editTaskList({ status: statusNow, order: dataRefNow });
            // TODO: update actual task status itself
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

    // TODO: testing section
    tasks: ITask[] = [];
    createSomeTasks() {
        for (let i = 1; i < 10; i++) {
            let someStatus: Status;
            switch (true) {
                case i < 3:
                    someStatus = Status.todo;
                    break;
                case i < 6:
                    someStatus = i == 5 ? Status.todo : Status.progress;
                    break;
                case i < 9:
                    someStatus = Status.await;
                    break;
                default:
                    someStatus = Status.done;
                    break;
            }
            this.tasks.push({
                id: i,
                created_at: new Date().toISOString(),
                title: 'Title ' + i,
                description: 'Description ' + i,
                category: 'User Story',
                priority: 'low',
                status: someStatus,
                user_ids: [],
                subtasks: [],
                //TODO Date
                due_date: '19.10.2016',
            });
        }
    }
}
