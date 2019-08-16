import {makeCardEditTemplate} from '../src/components/card-edit';
import {makeCardFilterTemplate} from '../src/components/card-filter';
import {makeCardTemplate} from '../src/components/card';
import {makeFilterTemplate} from '../src/components/filter';
import {makeLoadMoreTemplate} from '../src/components/load-more';
import {makeMenuTemplate} from '../src/components/menu';
import {makeSearchTemplate} from '../src/components/search';
import {getTask, getFilter} from './data';

let CARDS_COUNT = 7;
const PARTIALLY_CARDS_COUNT = 8;

const renderComponent = (parent, child, place) => {
  parent.insertAdjacentHTML(place, child);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

const renderMockComponents = () => {
  renderComponent(menuContainer, makeMenuTemplate(), `beforeend`);
  renderComponent(mainContainer, makeSearchTemplate(), `beforeend`);

  const allTasks = (card_count) => new Array(card_count).fill(``).map(getTask);
  const tasks = allTasks(CARDS_COUNT);

  renderComponent(mainContainer, makeFilterTemplate(getFilter(tasks)), `beforeend`);
  renderComponent(mainContainer, makeCardEditTemplate(getTask()), `beforeend`);

  const cardFilterContainer = mainContainer.querySelector(`.board`);
  const cardTasksContainer = cardFilterContainer.querySelector(`.board__tasks`);

  for (let i = 0; i <= CARDS_COUNT; i++) {
    renderComponent(cardTasksContainer, new Array(1).fill(getTask()).map(makeCardTemplate).join(``),`beforeend`);
  }
  renderComponent(cardFilterContainer, makeLoadMoreTemplate(), `beforeend`);

  const btnLoadMore = mainContainer.querySelector(`.load-more`);
  btnLoadMore.addEventListener('click', () => {
    for (let i = 0; i <= PARTIALLY_CARDS_COUNT; i++) {
      renderComponent(cardTasksContainer, new Array(1).fill(getTask()).map(makeCardTemplate).join(``),`beforeend`);
    }
    CARDS_COUNT = CARDS_COUNT + PARTIALLY_CARDS_COUNT;
    if (CARDS_COUNT > 20) {
      btnLoadMore.parentNode.removeChild(btnLoadMore);
    }
  })
};

renderMockComponents();
