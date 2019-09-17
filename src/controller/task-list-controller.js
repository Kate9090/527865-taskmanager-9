import TaskController, {Mode as TaskControllerMode} from './task-controller';

export default class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
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
    };

    this._creatingTask = new TaskController(
        this._container,
        defaultTask,
        TaskControllerMode.ADD,
        (...args) => {
          this._creatingTask = null;
          this._onDataChange(...args);
        },
        this._onChangeView
    );
  }

  _renderTask(task) {
    const taskController = new TaskController(this._container, task, TaskControllerMode.DEFAULT, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onDataChange(newData, oldData) {
    let taskIndex = this._tasks.findIndex((it) => it === oldData);

    if (newData === null) {
      this._tasks = [...this._tasks.slice(0, taskIndex), ...this._tasks.slice(taskIndex, this._tasks.length + 1)];
    } else if (oldData === null) {
      this._creatingTask = null;
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[taskIndex] = newData;
    }

    this.setTasks(this._tasks);

    this._onDataChangeMain(this._tasks);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }
}
