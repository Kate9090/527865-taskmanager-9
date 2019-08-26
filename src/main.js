import {Menu} from '../src/components/menu';
import {Filter} from '../src/components/filter';
import {Search} from '../src/components/search';
import {Task} from '../src/components/card';
import {TaskEdit} from '../src/components/card-edit';

// import {makeCardFilterTemplate} from '../src/components/card-filter';
// import {makeLoadMoreTemplate} from '../src/components/load-more';

import {render, Position} from './utils';
import {createTask, createFilter} from './data';

const CARDS_COUNT = 7;
const FILTER_COUNT = 7;
// const PARTIALLY_CARDS_COUNT = 8;

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
const taskContainer = mainContainer;


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

  render(taskContainer, task.getElement(), Position.BEFOREEND);
}

renderHeader();

const allTasks = [];
for (let i = 0; i <= CARDS_COUNT; i++) {
  allTasks.push(createTask());
}

const taskMocks = new Array(CARDS_COUNT).fill(``).map(createTask);
const filterMocks = new Array(FILTER_COUNT).fill(``).map(() => createFilter(allTasks));
// filterMocks.forEach((filterMock) => renderFilter(filterMock));


taskMocks.forEach((taskMock) => renderTask(taskMock));



// const mainContainer = document.querySelector(`.main`);
// const menuContainer = mainContainer.querySelector(`.board__tasks`);
// const renderComponent = (parent, child, place) => {
//   parent.insertAdjacentHTML(place, child);
// };
// let mountOfCards = CARDS_COUNT;

const renderMockComponents = () => {
  // renderComponent(menuContainer, makeMenuTemplate(), `beforeend`);
  // renderComponent(mainContainer, makeSearchTemplate(), `beforeend`);

  // const allTasks = [];
  // for (let i = 0; i <= CARDS_COUNT; i++) {
  //   allTasks.push(createTask());
  // }

  // renderComponent(mainContainer, makeFilterTemplate(createFilter(allTasks)), `beforeend`);
  // renderComponent(mainContainer, makeCardEditTemplate(createTask()), `beforeend`);

  // const cardFilterContainer = mainContainer.querySelector(`.board`);
  // const cardTasksContainer = cardFilterContainer.querySelector(`.board__tasks`);

  // renderComponent(cardTasksContainer, new Array(CARDS_COUNT + 1).fill(``).map(() => makeCardTemplate(createTask())).join(``),`beforeend`);
  // renderComponent(cardFilterContainer, makeLoadMoreTemplate(), `beforeend`);

  // const btnLoadMore = mainContainer.querySelector(`.load-more`);
  // btnLoadMore.addEventListener('click', () => {
  //   for (let i = 0; i <= PARTIALLY_CARDS_COUNT; i++) {
  //     renderComponent(cardTasksContainer, new Array(1).fill(createTask()).map(makeCardTemplate).join(``),`beforeend`);
  //   }
  //   mountOfCards = mountOfCards + PARTIALLY_CARDS_COUNT;
  //   if (mountOfCards > 20) {
  //     btnLoadMore.parentNode.removeChild(btnLoadMore);
  //   }
  // })
};

renderMockComponents();
