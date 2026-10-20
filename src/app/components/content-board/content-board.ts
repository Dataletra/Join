import { Component, computed, inject } from '@angular/core';
import { ButtonPrimary } from '../elements/button-primary/button-primary';
import { TaskListService } from '../../services/tasklist-service';
import { Status } from '../../interfaces/status';
import { ITask } from '../../interfaces/itask';
import { TasksService } from '../../services/tasks-service';
import { Task } from '../models/task';

@Component({
    imports: [ButtonPrimary],
    selector: 'app-content-board',
    styleUrl: './content-board.scss',
    templateUrl: './content-board.html',
})
export class ContentBoard {
    taskListService = inject(TaskListService);
    tasksService = inject(TasksService);
    private readonly Status = Status; // Make Status enum usable in HTML

    async ngOnInit() {
        this.fetchTaskLists();

        this.createSomeTasks();

        await this.tasksService.getTasks();

        //TODO Delete me
        // await this.testAddTask();
        // console.log('task per id', this.tasksService.getTaskPerId(2));
        console.log('all tasks', this.tasksService.tasklist());
        // console.log('task model', this.tasksService.tasklist()[0]);
    }

    // TODO Delete me
    async testAddTask() {
        const testtask = new Task({
            title: 'Trello aktualisieren',
            description: '',
            category: 'Technical Task',
            priority: 'low',
            status: Status.todo,
            user_ids: [],
            subtasks: [],
            due_date: '2026-10-25',
        });
        await this.tasksService.addTask(testtask);
    }

    async fetchTaskLists() {
        await this.taskListService.getTaskLists();

        // TODO: remove me - example how to update taskLists
        // this.taskListService.editTaskList({ status: Status.await, order: [] });
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
                    someStatus = Status.progress;
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
