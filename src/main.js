import {makeCardEditTemplate} from '../src/components/card-edit';
import {makeCardFilterTemplate} from '../src/components/card-filter';
import {makeCardTemplate} from '../src/components/card';
import {makeFilterTemplate} from '../src/components/filter';
import {makeLoadMoreTemplate} from '../src/components/load-more';
import {makeMenuTemplate} from '../src/components/menu';
import {makeSearchTemplate} from '../src/components/search';
import {createTask, createFilter} from './data';

const CARDS_COUNT = 7;
let mountOfCards = CARDS_COUNT;
const PARTIALLY_CARDS_COUNT = 8;

const renderComponent = (parent, child, place) => {
  parent.insertAdjacentHTML(place, child);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

const renderMockComponents = () => {
  renderComponent(menuContainer, makeMenuTemplate(), `beforeend`);
  renderComponent(mainContainer, makeSearchTemplate(), `beforeend`);

  const allTasks = [];
  for (let i = 0; i <= CARDS_COUNT; i++) {
    allTasks.push(createTask());
  }

  renderComponent(mainContainer, makeFilterTemplate(createFilter(allTasks)), `beforeend`);
  renderComponent(mainContainer, makeCardEditTemplate(createTask()), `beforeend`);

  const cardFilterContainer = mainContainer.querySelector(`.board`);
  const cardTasksContainer = cardFilterContainer.querySelector(`.board__tasks`);

  renderComponent(cardTasksContainer, new Array(CARDS_COUNT + 1).fill(``).map(() => makeCardTemplate(createTask())).join(``),`beforeend`);
  renderComponent(cardFilterContainer, makeLoadMoreTemplate(), `beforeend`);

  const btnLoadMore = mainContainer.querySelector(`.load-more`);
  btnLoadMore.addEventListener('click', () => {
    for (let i = 0; i <= PARTIALLY_CARDS_COUNT; i++) {
      renderComponent(cardTasksContainer, new Array(1).fill(createTask()).map(makeCardTemplate).join(``),`beforeend`);
    }
    mountOfCards = mountOfCards + PARTIALLY_CARDS_COUNT;
    if (mountOfCards > 20) {
      btnLoadMore.parentNode.removeChild(btnLoadMore);
    }
  })
};

renderMockComponents();
