import BoardController from './controller/board-controller';
import SearchController from './controller/search-controller';
import StatisticsController from './controller/statistic-controller';

import {Menu} from './components/menu';
import {Filter} from './components/filter';
import {Search} from './components/search';

import {createTask, createFilter} from './data';
import {Position, render} from './utils.js';
import { ENETDOWN } from 'constants';

export const TasksCount = {
  MAX: 20,
  LOAD: 8,
  PARTIALLY_CARDS_COUNT: 8
};
const allTasks = [...Array(TasksCount.MAX)].map(() => createTask());

const mainContainer = document.querySelector(`.main`);
let taskMocks = new Array(TasksCount.MAX).fill(``).map(createTask);
const filterMocks = createFilter(allTasks);
const menuContainer = mainContainer.querySelector(`.main__control`);

const onDataChange = (tasks) => {
  taskMocks = tasks;
};

const menu = new Menu();
const search = new Search();
const filter = new Filter(filterMocks);

filter.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `LABEL`) {
    return;
  }

  const filterParam = filterMocks.find((item) => item.title === evt.target.getAttribute(`for`)).flagName;

  if (filterParam === `All`) {
    taskListController.hide();
    return taskListController.show(taskMocks);
  }
  
  const filteredTasks = taskMocks.filter((taskMock) => taskMock[filterParam]);
  taskListController.hide();
  taskListController.show(filteredTasks);
});

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
render(mainContainer, filter.getElement(), Position.BEFOREEND);

const taskListController = new BoardController(mainContainer, onDataChange, filterMocks);
taskListController.show(taskMocks);

const statisticsController = new StatisticsController(mainContainer, taskMocks);
statisticsController.hide();
const onSearchBackButtonClick = () => {
  statisticsController.hide();
  searchController.hide();
  taskListController.show(taskMocks);
};
const searchController = new SearchController(mainContainer, search, onSearchBackButtonClick);

search.getElement().addEventListener(`click`, () => {
  statisticsController.show(taskMocks);
  taskListController.hide();
  searchController.show(taskMocks);
});

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
      statisticsController.hide();
      taskListController.show(taskMocks);
      break;
    case statisticId:
      taskListController.hide();
      statisticsController.show(taskMocks);
      break;
    case newTaskId:
      taskListController.createTask();
      menu.getElement().querySelector(`#${tasksId}`).checked = true;
      break;
  }
});
