import BoardController from './controller/board-controller';
import SearchController from './controller/search-controller';

import {Statistic} from './components/statistic';
import {Menu} from './components/menu';
import {Filter} from './components/filter';
import {Search} from './components/search';

import {createTask, createFilter} from './data';
import {Position, render} from './utils.js';

export const TasksCount = {
  MAX: 20,
  LOAD: 8,
  PARTIALLY_CARDS_COUNT: 8
};
const allTasks = [...Array(TasksCount.MAX)].map(() => createTask());

const mainContainer = document.querySelector(`.main`);
const taskMocks = new Array(TasksCount.MAX).fill(``).map(createTask);
const filterMocks = createFilter(allTasks);
const statistic = new Statistic();
const menuContainer = mainContainer.querySelector(`.main__control`);

const onDataChange = (tasks) => {
  taskMocks = tasks;
};

const menu = new Menu();
const search = new Search();
const filter = new Filter(filterMocks);

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
render(mainContainer, filter.getElement(), Position.BEFOREEND);

const taskListController = new BoardController(mainContainer, onDataChange, filterMocks);
taskListController.show(taskMocks);

render(mainContainer, statistic.getElement(), Position.BEFOREEND);
statistic.getElement().classList.add(`visually-hidden`);

const onSearchBackButtonClick = () => {
  statistic.getElement().classList.add(`visually-hidden`);
  searchController.hide();
  taskListController.show(taskMocks);
};
const searchController = new SearchController(mainContainer, search, onSearchBackButtonClick);



menu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  const tasksId = `control__task`;
  const statisticId = `control__statistic`;
  const newTaskId = `control__new-task`;

  switch (evt.target.id) {
    case tasksId:
      statistic.getElement().classList.add(`visually-hidden`);
      taskListController.show(taskMocks);
      break;
    case statisticId:
      taskListController.hide();
      statistic.getElement().classList.remove(`visually-hidden`);
      break;
    case newTaskId:
      taskListController.createTask();
      menu.getElement().querySelector(`#${tasksId}`).checked = true;
      break;
  }
});
