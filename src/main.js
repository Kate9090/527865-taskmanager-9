import {Menu} from '../src/components/menu';
import {Filter} from '../src/components/filter';
import {Search} from '../src/components/search';
import {Task} from '../src/components/card';
import {TaskEdit} from '../src/components/card-edit';
import {TaskFilter} from '../src/components/card-filter';
import {BtnLoadMore} from '../src/components/load-more';

import {render, Position, removeElement} from './utils';
import {createTask, createFilter} from './data';

const TasksCount = {
  MAX: 20,
  LOAD: 8,
  PARTIALLY_CARDS_COUNT: 8
};
const allTasks = [...Array(TasksCount.MAX)].map(() => createTask());

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
const taskMocks = new Array(TasksCount.LOAD).fill(``).map(createTask);
const filterMocks = createFilter(allTasks);

const renderHeader = () => {
  const menu = new Menu();
  const search = new Search();

  render(menuContainer, menu.getElement(), Position.BEFOREEND);
  render(mainContainer, search.getElement(), Position.BEFOREEND);
}

const renderFilter= (filterMock) => {
  const filter = new Filter(filterMock);
  render(mainContainer, filter.getElement(), Position.BEFOREEND);
}

const renderTaskFilter= () => {
  const taskFilter = new TaskFilter();
  render(mainContainer, taskFilter.getElement(), Position.BEFOREEND);
}

const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      taskContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  }

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
    })

  render(taskContainer, task.getElement(), Position.AFTERBEGIN);
}

const renderBtnLoadMore = () => {
  const btnLoadMore = new BtnLoadMore();
  render(taskContainer, btnLoadMore.getElement(), Position.BEFOREEND);
}

renderHeader();
renderFilter(filterMocks);
renderTaskFilter();

const taskContainer = mainContainer.querySelector(`.board__tasks`);
taskMocks.forEach((taskMock) => renderTask(taskMock));

renderBtnLoadMore();

const btnLoadMoreContainer = taskContainer.querySelector(`.load-more`);
let mountOfTasks = TasksCount.LOAD;

btnLoadMoreContainer.addEventListener('click', () => {
  let newTaskMocks = [];
  mountOfTasks = mountOfTasks + TasksCount.PARTIALLY_CARDS_COUNT;
  if (mountOfTasks > TasksCount.MAX) {
    newTaskMocks = new Array(mountOfTasks - TasksCount.MAX).fill(``).map(createTask);
    removeElement(btnLoadMoreContainer);
  } else {
    newTaskMocks = new Array(TasksCount.PARTIALLY_CARDS_COUNT).fill(``).map(createTask);
  }
  newTaskMocks.forEach((taskMock) => renderTask(taskMock));
});
