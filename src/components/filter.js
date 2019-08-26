import {createElement} from '../utils';

export class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<section class="main__filter filter container">
      ${this._filters.map((filter) => `<input
          type="radio"
          id="filter__all"
          class="filter__input visually-hidden"
          name="filter"
          checked
        />
        <label for="filter__all" class="filter__label">${filter.title}<span class="filter__all-count">${filter.getValue()}</span></label>`).join(``)}
    </section>`;
  }
}
