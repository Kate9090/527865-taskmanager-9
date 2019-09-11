import {Menu} from '../src/components/menu';
import {Filter} from '../src/components/filter';
import {Search} from '../src/components/search';
import {Task} from '../src/components/card';
import {TasksContainer} from '../src/components/board-tasks';
import {TaskEdit} from '../src/components/card-edit';
import {TaskListEmpty} from '../src/components/card-list-empty';
import {Sort} from './components/sort';
import {BtnLoadMore} from '../src/components/load-more';

import {createTask} from './data';
import {render, removeElement, Position, unrender} from './utils';

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._tasksContainer = new TasksContainer();
    this._sort = new Sort();
    this._mainContainer = document.querySelector(`.main`);
    this._menuContainer = this._mainContainer.querySelector(`.main__control`);
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

  _renderTask(taskMock) {
    const task = new Task(taskMock);
    const taskEdit = new TaskEdit(taskMock);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._tasksContainer.getElement().replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    task.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._tasksContainer.getElement().replaceChild(taskEdit.getElement(), task.getElement());
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
        this._tasksContainer.getElement().replaceChild(task.getElement(), taskEdit.getElement());

        const formData = new FormData(taskEdit.getElement().querySelector(`.card-form`));
        const entry = {
          description: formData.get(`text`),
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
          dueDate: new Date(formData.get(`date`)),
          repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
            acc[it] = true;
            return acc;
          }, {
            'mo': false,
            'tu': false,
            'we': false,
            'th': false,
            'fr': false,
            'sa': false,
            'su': false
          })
        };
        this._tasks[this._tasks.findIndex((it) => it === task)] = entry;
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._tasksContainer.getElement(), task.getElement(), Position.BEFOREEND);
  }

  _renderBtnLoadMore() {
    const btnLoadMore = new BtnLoadMore();
    render(this._sort.getElement(), btnLoadMore.getElement(), Position.BEFOREEND);
  }

  _renderBoard(tasks) {
    tasks.forEach((taskMock) => this._renderTask(taskMock));
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
