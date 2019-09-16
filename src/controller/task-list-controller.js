// import {Board} from '../components/board';
// import {TasksContainer} from '../components/board-tasks';
// import {TaskListEmpty} from '../components/card-list-empty';
// import {Sort} from '../components/sort';
// import {BtnLoadMore} from '../components/load-more';
// import {TasksCount} from '../main';

import TaskController, {Mode as TaskControllerMode} from './task-controller';

// import {createTask} from '../data';
// import {render, removeElement, Position, unrender} from '../utils';

// const TaskControllerMode = Mode;

export default class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = null;
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._tasks.forEach((task) => this._renderTask(task));
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
    this._tasks = this._tasks.concat(tasks);
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const defaultTask = {
      color: [],
      description: ``,
      dueDate: new Date(),
      endCount: 0,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false
      },
      startCount: 0,
      tags: new Set(),
    }

    this._creatingTask = new TaskController(
      this._container,
      defaultTask,
      TaskControllerMode.ADDING,
      (...args) => {
        this._creatingTask = null;
        this._onDataChange(...args);
      },
      this._onChangeView
    );
  }

  _renderTask(task) {
    const taskController = new TaskController(this._tasksContainer, task, TaskControllerMode.DEFAULT, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onDataChange(newData, oldData) {
    let taskIndex = this._tasks.findIndex((it) => it === oldData);
    
    if (newData === null) {
      this._tasks = [...this._tasks.slice(0, taskIndex), ...this._tasks.slice(taskIndex, this._tasks.length + 1)]
      // .slice(0, this._countOfShownTasks);
    } else if (oldData === null) {
      this._creatingTask = null;
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[taskIndex] = newData;
    }
    this._renderBoard(this._tasks);
    this._renderBtnLoadMore();
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }
}