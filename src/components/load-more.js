import {createElement} from '../utils';

export class BtnLoadMore {
  constructor() {
    this._element = null
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
    return `<button class="load-more" type="button">load more</button>`
  }
}
