import AbstractComponent from "./abstract-component.js";

/** Компонент меню сортировки
 * @extends AbstractComponent
 */
export default class SortMenuComponent extends AbstractComponent {
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
