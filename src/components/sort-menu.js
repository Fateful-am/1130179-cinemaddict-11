import AbstractRenderComponent from './abstract-render-component';


export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

/** Компонент меню сортировки
 * @extends AbstractRenderComponent
 */
export default class SortMenuComponent extends AbstractRenderComponent {
  constructor(container, place) {
    super(container, place);

    this._clickHandler = null;
    this._currenSortType = SortType.DEFAULT;
    this.render();
  }

  /**
   * Генерация шаблона меню сортировки
   * @return {string} - Шаблон меню сортировки
   * @private
   */
  _getSortMenuItemsTemplate() {
    const items = [];
    for (let item in SortType) {
      if (SortType.hasOwnProperty(item)) {
        const sortActive = this._currenSortType === SortType[item] ? `sort__button--active` : ``;
        items.push(`<li><a href="#" data-sort-type="${SortType[item]}" class="sort__button ${sortActive}">Sort by ${SortType[item]}</a></li>`);
      }
    }

    return items.join(`\n`);
  }

  getTemplate() {
    return (
      `<ul class="sort">
        ${this._getSortMenuItemsTemplate()}
    </ul>`
    );
  }

  /**
   * Текущий тип сортировки
   * @return {string} - Текущий тип сортировки
   */
  getSortType() {
    return this._currenSortType;
  }

  /**
   * Установка обработчика клика по сортировке
   * @param {function} handler - Коллбэк функция клика
   */
  setSortTypeChangeHandler(handler) {
    this._clickHandler = handler;
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;
      handler(this._currenSortType);
      this.reRender();
    });
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._clickHandler);
  }

}
