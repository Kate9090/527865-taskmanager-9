import {AbstractComponent} from './abstract-component';

export class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
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
