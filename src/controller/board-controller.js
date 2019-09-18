import {Board} from '../components/board';
import {TasksContainer} from '../components/board-tasks';
import {TaskListEmpty} from '../components/card-list-empty';
import {Sort} from '../components/sort';
import {BtnLoadMore} from '../components/load-more';
import {TasksCount} from '../main';

import TaskListController from './task-list-controller';
import {render, Position, unrender} from '../utils';

export default class BoardController {
  constructor(container, onDataChange, filterMocks) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._tasks = [];
    this._filterMock = filterMocks;
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
    this._taskListController = new TaskListController(this._tasksContainer.getElement(), this._onDataChange.bind(this));
    this._init();
  }

  _notCompletedTasksCount(tasks) {
    const countOfArchivedTasks = this._filterMock.find((item) => item.title === `Archive`).getValue();
    const countOfAllTasks = this._filterMock.find((item) => item.title === `All`).getValue();

    return tasks.length === 0 || countOfAllTasks === countOfArchivedTasks;
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

  _renderBtnLoadMore() {
    if (this._countOfShownTasks <= TasksCount.MAX) {
      render(this._board.getElement(), this._btnLoadMore.getElement(), Position.BEFOREEND);
    }
  }

  _renderBoard(tasks) {
    console.log(tasks)
    render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);

    this._renderBtnLoadMore();
    this._btnLoadMore.getElement().addEventListener(`click`, this._onLoadMoreBtnClick);
    this._taskListController.setTasks(tasks.slice(0, this._countOfShownTasks));
  }

  _onDataChange(tasks) {
    this._tasks = tasks;

    this._onDataChangeMain(this._tasks);
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
    this._taskListController.addTasks(this._tasks.slice(0, TasksCount.PARTIALLY_CARDS_COUNT));
  }

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
        this._taskListController.setTasks(sortedByDateUpTasks);
        break;
      case `date-down`:
        this._sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        const sortedByDateDownTasks = this._sortedTasks;
        this._taskListController.setTasks(sortedByDateDownTasks);
        break;
      case `default`:
        this._sortedTasks = null;
        const sortedByDefaultTasks = this._tasks;
        this._taskListController.setTasks(sortedByDefaultTasks);
        break;
    }
  }

  _init() {
    this._renderContainer();
    this._renderSort();
    this._renderBtnLoadMore();

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortingByType(evt));
  }

  show(tasks) {
    if (tasks !== this._tasks) {
      this._setTasks(tasks);
    }
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  createTask() {
    this._taskListController.createTask();
  }

  _setTasks(tasks) {
    this._tasks = tasks;
    this._countOfShownTasks = TasksCount.LOAD;

    if (this._notCompletedTasksCount(this._tasks)) {
      this._renderEmptyTasksList();
    } else {
      this._renderBoard(this._tasks);
    }
  }
}
