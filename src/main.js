import {makeCardEditTemplate} from '../src/components/card-edit'; //+
import {makeCardFilterTemplate} from '../src/components/card-filter';
import {makeCardTemplate} from '../src/components/card';
import {makeFilterTemplate} from '../src/components/filter'; //+
import {makeLoadMoreTemplate} from '../src/components/load-more';
import {makeMenuTemplate} from '../src/components/menu'; //+
import {makeSearchTemplate} from '../src/components/search';

const CARDS_COUNT = 3;

const renderComponent = (parent, child) => {
  parent.insertAdjacentHTML(`beforeend`, child);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.control__btn-wrap`);
const searchContainer = mainContainer.querySelector(`.main__search`);
const filterContainer = mainContainer.querySelector(`.main__filter`);
const cardFilterContainer = mainContainer.querySelector(`.board__tasks-filter`);
const cardTasksContainer = mainContainer.querySelector(`.board__tasks`);
const cardTasksLoadBtnContainer = mainContainer.querySelector(`.board.container`);

const renderMockComponents = () => {
  renderComponent(cardTasksContainer, makeCardEditTemplate());
  renderComponent(menuContainer, makeMenuTemplate());
  renderComponent(searchContainer, makeSearchTemplate());
  renderComponent(filterContainer, makeFilterTemplate());

  renderComponent(cardFilterContainer, makeCardFilterTemplate());

  for (let i = 1; i <= CARDS_COUNT; i++) {
    renderComponent(cardTasksContainer, makeCardTemplate());
  }

  renderComponent(cardTasksLoadBtnContainer, makeLoadMoreTemplate());
};

renderMockComponents();
