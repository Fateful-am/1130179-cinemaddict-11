import AbstractRenderComponent from './abstract-render-component';

/** Компонент меню сортировки
 * @extends AbstractRenderComponent
 */
export default class SortMenuComponent extends AbstractRenderComponent {
  constructor(container, place) {
    super(container, place);

    this.render();
  }

  getTemplate() {
    return (
      `<ul class="sort">
       <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
       <li><a href="#" class="sort__button">Sort by date</a></li>
       <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
    );
  }
}
