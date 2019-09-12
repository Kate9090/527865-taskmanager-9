import {AbstractComponent} from './abstract-component';

export class Board extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="board container">
    </section>`;
  }
}
