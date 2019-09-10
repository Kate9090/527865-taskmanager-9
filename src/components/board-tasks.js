import {AbstractComponent} from './abstract-component';

export class TasksContainer extends AbstractComponent {

  getTemplate() {
    return `<div class="board__tasks">
    </div>`;
  }
}
