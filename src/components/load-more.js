import {AbstractComponent} from './abstract-component';

export class BtnLoadMore  extends  AbstractComponent {
  constructor() {
    super();
  }
  
  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }
}
