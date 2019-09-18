import BoardController from './controller/board-controller';
import SearchController from './controller/search-controller';
import StatisticsController from './controller/statistic-controller';

import {Menu} from './components/menu';
import {Filter} from './components/filter';
import {Search} from './components/search';

import {createFilter} from './data';
import {Position, render, Action, ButtonText} from './utils.js';

// import ModelTasks from './model-tasks';
import {API} from './api';

const mainContainer = document.querySelector(`.main`);
// let taskMocks = new Array(TasksCount.MAX).fill(``).map(createTask);

const menuContainer = mainContainer.querySelector(`.main__control`);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/task-manager`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

api.getTasks().then((taskMocks) => {
  const updateData = (newTasks) => {
    boardController.show(newTasks);
    searchController.setTasks(newTasks);
    statisticsController.setTasks(newTasks);
    statisticsController.hide();
  };
  const onDataChange = (actionType, update, element) => {
    switch (actionType) {
      case Action.UPDATE:
        element.block();
        element.changeSubmitBtnText(ButtonText.SAVING);
        api.updateTask({
          id: update.id,
          data: ModelTasks.toRAW(update)
        })
          .then(() => api.getTasks())
          .then((data) => updateData(data))
          .catch(() => {
            element.shake();
            element.unblock();
            element.changeSubmitBtnText(ButtonText.SAVE);
          });
        break;
      case Action.DELETE:
        element.block();
        element.changeDeleteBtnText(ButtonText.DELETING);
        api.deleteTask({
          id: update.id
        })
          .then(() => api.getTasks())
          .then((data) => updateData(data))
          .catch(() => {
            element.shake();
            element.unblock();
            element.changeDeleteBtnText(ButtonText.DELETE);
          });
        break;
      case Action.CREATE:
        element.block();
        element.changeSubmitBtnText(ButtonText.SAVING);
        api.createTask({
          task: ModelTasks.toRAW(update)
        })
          .then(() => api.getTasks())
          .then((data) => updateData(data))
          .catch(() => {
            element.shake();
            element.unblock();
            element.changeSubmitBtnText(ButtonText.SAVE);
          });
        break;
    }
  };

  const menu = new Menu();
  const search = new Search();
  const filterMocks = createFilter(taskMocks);
  const filter = new Filter(filterMocks);
  

  filter.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    statisticsController.hide();

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
    statisticsController.hide();
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
        searchController.hide();
        break;
      case statisticId:
        taskListController.hide();
        statisticsController.show(taskMocks);
        searchController.hide();
        break;
      case newTaskId:
        taskListController.show(taskMocks);
        taskListController.createTask();
        statisticsController.hide();
        searchController.hide();
        menu.getElement().querySelector(`#${tasksId}`).checked = true;
        break;
    }
  });
})
