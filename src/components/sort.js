import {AbstractComponent} from './abstract-component';

export class Sort extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="board container">
      <div class="board__filter-list">
        <a href="#" class="board__filter" data="default">SORT BY DEFAULT</a>
        <a href="#" class="board__filter" data="dateUp">SORT BY DATE up</a>
        <a href="#" class="board__filter" data="dateDown">SORT BY DATE down</a>
      </div>
      <div class="board__tasks">
      </div>
    </section>`;
  }
}
