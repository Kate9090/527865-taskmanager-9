import {Board} from '../components/board';
import {TasksContainer} from '../components/board-tasks';
import {TaskListEmpty} from '../components/card-list-empty';
import {Sort} from '../components/sort';
import {BtnLoadMore} from '../components/load-more';
import {TasksCount} from '../main';

import TaskController, {Mode} from './task-controller';
import {createTask} from '../data';
import {render, removeElement, Position, unrender} from '../utils';
import TaskListController from './task-list-controller';

const TaskControllerMode = Mode;

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._tasksContainer = new TasksContainer();
    this._sort = new Sort();
    this._board = new Board();
    this._btnLoadMore = new BtnLoadMore();
    this._mainContainer = document.querySelector(`.main`);
    
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._creatingTask = null;

    this._taskListController = new TaskListController(this._tasksContainer.getElement(), this._onDataChange.bind(this));
  }

  _notCompletedTasksCount(taskMocks, filterMocks) {
    const countOfArchivedTasks = filterMocks.find((item) => item.title === `Archive`).getValue();
    const countOfAllTasks = filterMocks.find((item) => item.title === `All`).getValue();

    return taskMocks.length === 0 || countOfAllTasks === countOfArchivedTasks;
  }

  _renderContainer() {
    render(this._mainContainer, this._board.getElement(), Position.BEFOREEND);
  }

  _renderSort() {
    render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
  }

  _renderEmptyTasksList() {
    const taskListEmpty = new TaskListEmpty();
    render(this._tasksContainer.getElement(), taskListEmpty.getElement(), Position.AFTERBEGIN);
  }

  _renderTask(task) {
    const taskController = new TaskController(this._tasksContainer, task, TaskControllerMode.DEFAULT, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _renderBtnLoadMore() {
    unrender(this._btnLoadMore.getElement());
    this._btnLoadMore.removeElement();

    render(this._board.getElement(), this._btnLoadMore.getElement(), Position.BEFOREEND);
  }

  _renderBoard() {
    unrender(this._tasksContainer.getElement());
    this._tasksContainer.removeElement();

    this._taskListController.setTasks(this._tasks);

    // render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);
    // tasks.forEach((taskMock) => this._renderTask(taskMock));
  }

  _onDataChange(tasks) {
    // let taskIndex = this._tasks.findIndex((it) => it === oldData);
    
    // if (newData === null) {
    //   this._tasks = [...this._tasks.slice(0, taskIndex), ...this._tasks.slice(taskIndex, this._tasks.length + 1)]
    //   // .slice(0, this._countOfShownTasks);
    // } else if (oldData === null) {
    //   this._creatingTask = null;
    //   this._tasks = [newData, ...this._tasks];
    // } else {
    //   this._tasks[taskIndex] = newData;
    // }
    this._tasks = tasks;
    this._renderBoard(this._tasks);
    this._renderBtnLoadMore();

  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  init(taskMocks, filterMocks) {
    let countForRender = TasksCount.LOAD;

    this._renderContainer();
    this._renderSort();

    const onSortingByType = (e) => {
      e.preventDefault();

      const onRerenderBtnLoadMore = () => {
        if (countForRender < TasksCount.MAX) {
          this._renderBtnLoadMore();
          const btnLoadMoreContainer = this._mainContainer.querySelector(`.load-more`);
          btnLoadMoreContainer.addEventListener(`click`, onLoadMoreBtnClick);
        }
      };
      if (e.target.tagName !== `A`) {
        return;
      }

      this._tasksContainer.getElement().innerHTML = ``;

      switch (e.target.dataset.sortType) {
        case `date-up`:
          this._sortedTasks = taskMocks.slice().sort((a, b) => a.dueDate - b.dueDate);
          const sortedByDateUpTasks = this._sortedTasks.slice(0, countForRender);

          this._renderBoard(sortedByDateUpTasks);
          onRerenderBtnLoadMore();
          break;
        case `date-down`:
          this._sortedTasks = taskMocks.slice().sort((a, b) => b.dueDate - a.dueDate);
          const sortedByDateDownTasks = this._sortedTasks.slice(0, countForRender);

          this._renderBoard(sortedByDateDownTasks);
          onRerenderBtnLoadMore();
          break;
        case `default`:
          this._sortedTasks = null;
          const sortedByDefaultTasks = taskMocks.slice(0, countForRender);

          this._renderBoard(sortedByDefaultTasks);
          onRerenderBtnLoadMore();
          break;
      }
    };

    if (this._notCompletedTasksCount(taskMocks, filterMocks)) {
      this._renderEmptyTasksList();
    } else {
      this._renderBoard(taskMocks.slice(0, countForRender));
      this._sort.getElement().addEventListener(`click`, (evt) => onSortingByType(evt));
    }

    let newTaskMocks = [];

    const onLoadMoreBtnClick = () => {
      countForRender = countForRender + TasksCount.PARTIALLY_CARDS_COUNT;
      if (countForRender >= TasksCount.MAX) {
        newTaskMocks = new Array(countForRender - TasksCount.MAX).fill(``).map(createTask);
        removeElement(btnLoadMoreContainer);
      } else {
        newTaskMocks = new Array(TasksCount.PARTIALLY_CARDS_COUNT).fill(``).map(createTask);
      }
      newTaskMocks.forEach((task) => this._renderTask(task));
    };

    this._renderBtnLoadMore();
    const btnLoadMoreContainer = this._mainContainer.querySelector(`.load-more`);
    btnLoadMoreContainer.addEventListener(`click`, onLoadMoreBtnClick);
  }

  show() {
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
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

    this._creatingTask = new TaskController(this._tasksContainer, defaultTask, TaskControllerMode.ADD, this._onDataChange, this._onChangeView);
  }
}