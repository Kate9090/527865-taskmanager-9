import {Board} from '../components/board';
import {TasksContainer} from '../components/board-tasks';
import {TaskListEmpty} from '../components/card-list-empty';
import {Sort} from '../components/sort';
import {BtnLoadMore} from '../components/load-more';
import {TasksCount} from '../main';

import TaskController, {Mode} from './task-controller';
import {createTask} from '../data';
import {render, removeElement, Position, unrender} from '../utils';

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
    this._onLoadMoreBtnClick = this._onLoadMoreBtnClick.bind(this);
    this._onSortingByType = this._onSortingByType.bind(this);
    this._countOfShownTasks = TasksCount.LOAD;
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
    if (this._countOfShownTasks <= TasksCount.MAX) {
      render(this._board.getElement(), this._btnLoadMore.getElement(), Position.BEFOREEND);
    }
  }

  _renderBoard(tasks) {
    unrender(this._tasksContainer.getElement());
    this._tasksContainer.removeElement();

    render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);
    
    this._renderBtnLoadMore();
    this._btnLoadMore.getElement().addEventListener(`click`, this._onLoadMoreBtnClick);
    tasks.slice(0, this._countOfShownTasks).forEach((taskMock) => this._renderTask(taskMock));
  }

  _onDataChange(newData, oldData) {
    let taskIndex = this._tasks.findIndex((it) => it === oldData);
    
    if (newData === null) {
      this._tasks = [...this._tasks.slice(0, taskIndex), ...this._tasks.slice(taskIndex, this._tasks.length + 1)].slice(0, this._countOfShownTasks);
    } else {
      this._tasks[taskIndex] = newData;
    }
    this._renderBoard(this._tasks);
    
    this._renderBtnLoadMore();
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onLoadMoreBtnClick() {
    this._countOfShownTasks = this._countOfShownTasks + TasksCount.PARTIALLY_CARDS_COUNT;
    if (this._countOfShownTasks >= TasksCount.MAX) {
      unrender(this._btnLoadMore.getElement());
      this._btnLoadMore.removeElement();
      TasksCount.PARTIALLY_CARDS_COUNT = this._countOfShownTasks - TasksCount.MAX;
    }
    this._tasks.slice(0, TasksCount.PARTIALLY_CARDS_COUNT).forEach((task) => this._renderTask(task));
  };

  _onSortingByType(e) {
    e.preventDefault();

    if (e.target.tagName !== `A`) {
      return;
    }

    this._tasksContainer.getElement().innerHTML = ``;

    switch (e.target.dataset.sortType) {
      case `date-up`:
        this._sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        const sortedByDateUpTasks = this._sortedTasks;

        this._renderBoard(sortedByDateUpTasks);
        break;
      case `date-down`:
        this._sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        const sortedByDateDownTasks = this._sortedTasks;

        this._renderBoard(sortedByDateDownTasks);
        break;
      case `default`:
        this._sortedTasks = null;
        const sortedByDefaultTasks = this._tasks;

        this._renderBoard(sortedByDefaultTasks);
        break;
    }
  };

  init(taskMocks, filterMocks) {
    this._renderContainer();
    this._renderSort();
    this._renderBtnLoadMore();

    if (this._notCompletedTasksCount(taskMocks, filterMocks)) {
      this._renderEmptyTasksList();
    } else {
      this._renderBoard(taskMocks);
    }

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortingByType(evt));
    this._btnLoadMore.getElement().addEventListener(`click`, this._onLoadMoreBtnClick);
  }

  show() {
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  createTask() {
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

    const taskController = new TaskController(this._tasksContainer, defaultTask, TaskControllerMode.ADD, this._onDataChange, this._onChangeView);
  }
}
