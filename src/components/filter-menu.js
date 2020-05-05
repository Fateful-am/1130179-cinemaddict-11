import AbstractRenderComponent from './abstract-render-component';
import {FilterType} from '../const.js';

/** Компонент главного меню сайта
 * @extends AbstractRenderComponent
 */
export default class FilterMenuComponent extends AbstractRenderComponent {
  constructor(container, place) {
    super(container, place);

    this._filterChangeHandler = null;
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
    const className = name === FilterType.STATS ? `main-navigation__additional` : `main-navigation__item`;
    const countSpan = name === FilterType.ALL || name === FilterType.STATS ? `` :
      `<span class="main-navigation__item-count">${count}</span>`;
    const anchorText = name === FilterType.ALL ? `all` : name.toLowerCase();
    return (
      `<a href="#${anchorText}" class="${className} ${activeClass}">${name}${countSpan}</a>`
    );
  }

  getTemplate() {
    const filterMarkup = this._filters.slice(0, this._filters.length - 1).map((it) => this._createFilterMarkup(it)).join(`\n`);
    const statsFilterMarkup = this._filters.slice(-1).map((it) => this._createFilterMarkup(it))[0];
    return (
      `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterMarkup}
      </div>
      ${statsFilterMarkup}
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

  setFilterChangeHandler(handler) {
    this._filterChangeHandler = handler;
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      let filterName = evt.target.hash.slice(1);
      filterName = filterName === `all` ? FilterType.ALL : filterName.charAt(0).toUpperCase() + filterName.slice(1);
      handler(filterName);
    });
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
  }
}
