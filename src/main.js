import {makeCardEditTemplate} from '../src/components/card-edit'; //+
import {makeCardFilterTemplate} from '../src/components/card-filter';
import {makeCardTemplate} from '../src/components/card';
import {makeFilterTemplate} from '../src/components/filter'; //+
import {makeLoadMoreTemplate} from '../src/components/load-more';
import {makeMenuTemplate} from '../src/components/menu'; //+
import {makeSearchTemplate} from '../src/components/search';

const CARDS_COUNT = 3;

const renderComponent = (parent, child, place) => {
  parent.insertAdjacentHTML(place, child);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
// const searchContainer = mainContainer.querySelector(`.main__search`);
// const filterContainer = mainContainer.querySelector(`.main__filter`);

// const cardTasksLoadBtnContainer = mainContainer.querySelector(`.board.container`);

const renderMockComponents = () => {
  renderComponent(menuContainer, makeMenuTemplate(), `beforeend`);
  renderComponent(mainContainer, makeSearchTemplate(), `beforeend`);
  renderComponent(mainContainer, makeFilterTemplate(), `beforeend`);

  renderComponent(mainContainer, makeCardEditTemplate(),`beforeend`);

  const cardFilterContainer = mainContainer.querySelector(`.board`);
  const cardTasksContainer = cardFilterContainer.querySelector(`.board__tasks`);

  renderComponent(cardFilterContainer, makeCardFilterTemplate(), `afterbegin`);


  for (let i = 1; i <= CARDS_COUNT; i++) {
    renderComponent(cardTasksContainer, makeCardTemplate(), `beforeend`);
  }

  renderComponent(cardFilterContainer, makeLoadMoreTemplate(), `beforeend`);
};

renderMockComponents();
