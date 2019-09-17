import {AbstractComponent} from './abstract-component';

export class SearchResultGroup extends AbstractComponent {
  getTemplate() {
    return `<section class="result__group">
      <div class="result__cards"></div>
      <!--Append tasks here-->
    </section>`;
  }
}
