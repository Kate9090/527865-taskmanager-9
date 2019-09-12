import {Menu} from '../components/menu';
import {Filter} from '../components/filter';
import {Search} from '../components/search';
import {Task} from '../components/card';
import {TasksContainer} from '../components/board-tasks';
import {TaskEdit} from '../components/card-edit';
import {TaskListEmpty} from '../components/card-list-empty';
import {Sort} from '../components/sort';
import {BtnLoadMore} from '../components/load-more';

import TaskController from './task-controller';
import {createTask} from '../data';
import {render, removeElement, Position, unrender} from '../utils';

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._tasksContainer = new TasksContainer();
    this._sort = new Sort();
    this._mainContainer = document.querySelector(`.main`);
    this._menuContainer = this._mainContainer.querySelector(`.main__control`);

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  _notCompletedTasksCount(taskMocks, filterMocks) {
    const countOfArchivedTasks = filterMocks.find((item) => item.title === `Archive`).getValue();
    const countOfAllTasks = filterMocks.find((item) => item.title === `All`).getValue();

    return taskMocks.length === 0 || countOfAllTasks === countOfArchivedTasks;
  }

  _renderHeader() {
    const menu = new Menu();
    const search = new Search();

    render(this._menuContainer, menu.getElement(), Position.BEFOREEND);
    render(this._mainContainer, search.getElement(), Position.BEFOREEND);
  }

  _renderFilter(filterMock) {
    const filter = new Filter(filterMock);
    render(this._mainContainer, filter.getElement(), Position.BEFOREEND);
  }

  _renderSort() {
    render(this._mainContainer, this._sort.getElement(), Position.BEFOREEND);
    render(this._sort.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);
  }

  _renderEmptyTasksList() {
    const taskListEmpty = new TaskListEmpty();
    render(this._tasksContainer.getElement(), taskListEmpty.getElement(), Position.AFTERBEGIN);
  }

  _renderTask(task) {
    const taskController = new TaskController(this._tasksContainer, task, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _renderBtnLoadMore() {
    const btnLoadMore = new BtnLoadMore();
    render(this._sort.getElement(), btnLoadMore.getElement(), Position.BEFOREEND);
  }

  _renderBoard(tasks) {
    tasks.forEach((taskMock) => this._renderTask(taskMock));
  }

  _onDataChange(newData, oldData) {
    let taskIndex = this._tasks.findIndex((it) => it === oldData);
    this._tasks[taskIndex] = newData;

    this._renderBoard(this._tasks);

    // if (this._sortedTasks) {
    //   taskIndex = this._sortedTasks.findIndex((it) => it === oldData);
    //   this._sortedTasks[taskIndex] = newData;
    // }

    // unrender(this._tasksContainer.getElement());
    // this._tasksContainer.removeElement();

    // const thisTasks = this._sortedTasks ? this._sortedTasks.slice() : this._tasks.slice();
    // render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);

    // if (taskIndex > 7) {
    //   thisTasks.forEach((taskMock) => {
    //     const taskController = new TaskController(this._tasksContainer, taskMock, this._onDataChange, this._onChangeView);
    //     this._subscriptions.push(taskController.setDefaultView.bind(taskController));
    //   });
    // } else {
    //   this._renderTasks(thisTasks);
    // }
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it())
  }

  init(taskMocks, filterMocks) {
    this._renderHeader();
    this._renderFilter(filterMocks);
    this._renderSort();

    const onSortingByType = (e) => {
      e.preventDefault();

      if (e.target.tagName !== `A`) {
        return;
      }

      this._tasksContainer.getElement().innerHTML = ``;

      switch (e.target.dataset.sortType) {
        case `date-up`:
          this._sortedTasks = taskMocks.slice().sort((a, b) => a.dueDate - b.dueDate);
          const sortedByDateUpTasks = this._sortedTasks.slice();
          this._renderBoard(sortedByDateUpTasks)
          
          break;
        case `date-down`:
          this._sortedTasks = taskMocks.slice().sort((a, b) => b.dueDate - a.dueDate);
          const sortedByDateDownTasks = this._sortedTasks.slice();
          this._renderBoard(sortedByDateDownTasks)
          
          break;
        case `default`:
          this._sortedTasks = null;
          const sortedByDefaultTasks = taskMocks.slice();
          this._renderBoard(sortedByDefaultTasks);
          
          break;
      }
    }

    if (this._notCompletedTasksCount(taskMocks, filterMocks)) {
      this._renderEmptyTasksList();
    } else {
      this._renderBoard(taskMocks);
      
      this._sort.getElement().addEventListener(`click`, (evt) => onSortingByType(evt));
    }
    this._renderBtnLoadMore();

    const TasksCount = {
      MAX: 20,
      LOAD: 8,
      PARTIALLY_CARDS_COUNT: 8
    };

    let mountOfTasks = TasksCount.LOAD;
    let newTaskMocks = [];

    const onLoadMoreBtnClick = () => {
      mountOfTasks = mountOfTasks + TasksCount.PARTIALLY_CARDS_COUNT;
      if (mountOfTasks > TasksCount.MAX) {
        newTaskMocks = new Array(mountOfTasks - TasksCount.MAX).fill(``).map(createTask);
        removeElement(btnLoadMoreContainer);
      } else {
        newTaskMocks = new Array(TasksCount.PARTIALLY_CARDS_COUNT).fill(``).map(createTask);
      }
      taskMocks = taskMocks.concat(newTaskMocks);
      this._renderBoard(newTaskMocks);
    };

    const btnLoadMoreContainer = this._mainContainer.querySelector(`.load-more`);
    btnLoadMoreContainer.addEventListener(`click`, onLoadMoreBtnClick);
  }
}
