import AbstractRenderComponent from './abstract-render-component';
import {FilterType} from '../const.js';

/** Компонент главного меню сайта
 * @extends AbstractRenderComponent
 */
export default class FilterMenuComponent extends AbstractRenderComponent {
  constructor(container, place) {
    super(container, place);

    // Установка фильтра по умолчанию
    this._filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: 0,
        checked: filterType === FilterType.ALL
      };
    });

    this.render();
  }
  /**
   * Генерирует разметку пункта меню фильтра
   * @param {{name: string, count: number, checked: boolean}} filter Объект с параметрамерами фильтра
   * @return {string} Разметка пункта меню фильтра
   */
  _createFilterMarkup(filter) {
    const {name, count, checked} = filter;
    const activeClass = checked ? `main-navigation__item--active` : ``;
    const [anchorText, countSpan] = name === FilterType.ALL ?
      [`all`, ``] :
      [name.toLowerCase(), `<span class="main-navigation__item-count">${count}</span>`];

    return (
      `<a href="#${anchorText}" class="main-navigation__item ${activeClass}">${name}${countSpan}</a>`
    );
  }

  getTemplate() {
    const filterMarkup = this._filters.map((it) => this._createFilterMarkup(it)).join(`\n`);
    return (
      `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
    );
  }

  /**
   * Установка списка фильтров
   * @param {Object} value - Объект фильтров
   */
  set filters(value) {
    this._filters = value;
    this.reRender();
  }

  recoveryListeners() {}

}
