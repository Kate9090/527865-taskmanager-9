import {Menu} from '../src/components/menu';
import {Filter} from '../src/components/filter';
import {Search} from '../src/components/search';
import {Task} from '../src/components/card';
import {TaskEdit} from '../src/components/card-edit';
import {TaskListEmpty} from '../src/components/card-list-empty';
import {TaskFilter} from '../src/components/card-filter';
import {BtnLoadMore} from '../src/components/load-more';

import {createTask} from './data';
import {render, Position} from './utils';

export default class BoardController {
	constructor(container, data) {
    this._container = container;
    this._data = data;
    this._mainContainer = document.querySelector(`.main`);
    this._menuContainer = this._mainContainer.querySelector(`.main__control`);
  }

  _notCompletedTasksCount(taskMocks, filterMocks) {
    const countOfArchivedTasks = filterMocks.find((item) => item.title === `Archive`).getValue();
    const countOfAllTasks = filterMocks.find((item) => item.title === `All`).getValue();
  
    return taskMocks.length === 0 || countOfAllTasks === countOfArchivedTasks;
  };
  
  _renderHeader() {
    const menu = new Menu();
    const search = new Search();
  
    render(this._menuContainer, menu.getElement(), Position.BEFOREEND);
    render(this._mainContainer, search.getElement(), Position.BEFOREEND);
  };
  
  _renderFilter(filterMock) {
    const filter = new Filter(filterMock);
    render(this._mainContainer, filter.getElement(), Position.BEFOREEND);
  };
  
  _renderTaskFilter() {
    const taskFilter = new TaskFilter();
    render(this._mainContainer, taskFilter.getElement(), Position.BEFOREEND);
  };
  
  _renderEmptyTasksList() {
    const taskListEmpty = new TaskListEmpty();
    const taskContainer = mainContainer.querySelector(`.board__tasks`);
  
    render(taskContainer, taskListEmpty.getElement(), Position.AFTERBEGIN);
  };
  
  _renderTask(taskMock) {
    const task = new Task(taskMock);
    const taskEdit = new TaskEdit(taskMock);
    const taskContainer = this._mainContainer.querySelector(`.board__tasks`);
  
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        taskContainer.replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };
  
    task.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        taskContainer.replaceChild(taskEdit.getElement(), task.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });
  
    taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
  
    taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });
  
    taskEdit.getElement().querySelector(`.card__save`)
      .addEventListener(`click`, () => {
        taskContainer.replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
  
    render(taskContainer, task.getElement(), Position.AFTERBEGIN);
  };

  _renderBtnLoadMore() {
    const btnLoadMore = new BtnLoadMore();
    const taskContainer = this._mainContainer.querySelector(`.board__tasks`);
    render(taskContainer, btnLoadMore.getElement(), Position.BEFOREEND);
  };

  _onLoadMoreBtnClick(mountOfTasks, newTaskMocks, tasksPrtially, tasksMax) {
    mountOfTasks = mountOfTasks + tasksPrtially;
    if (mountOfTasks > tasksMax) {
      newTaskMocks = new Array(mountOfTasks - tasksMax).fill(``).map(createTask);
      removeElement(btnLoadMoreContainer);
    } else {
      newTaskMocks = new Array(tasksPrtially).fill(``).map(createTask);
    }
    newTaskMocks.forEach((taskMock) => this._renderTask(taskMock));
  };

  _init(taskMocks, filterMocks, tasksCountLoad, tasksPrtially, tasksMax) {
    this._renderHeader();
    this._renderFilter(filterMocks);
    this._renderTaskFilter();
    if (this._notCompletedTasksCount(taskMocks, filterMocks)) {
      this._renderEmptyTasksList();
    } else {
      taskMocks.forEach((taskMock) => this._renderTask(taskMock));
    }
    this._renderBtnLoadMore();

    let mountOfTasks = tasksCountLoad;
    let newTaskMocks = [];
    const btnLoadMoreContainer = this._mainContainer.querySelector(`.load-more`);
    btnLoadMoreContainer.addEventListener(`click`, this._onLoadMoreBtnClick(mountOfTasks, newTaskMocks, tasksPrtially, tasksMax));

  }
}