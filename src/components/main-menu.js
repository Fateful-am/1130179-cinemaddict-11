import {createElement} from "../utils.js";

export default class MainMenuComponent {
  constructor(filters) {
    this._filters = filters;

    this._element = null;
  }
  /**
   * Генерирует разметку пункта меню фильтра
   * @param {{name: string, count: number}} filter Объект с параметрамерами фильтра
   * @param {boolean} isActive Признак активности пункта меню
   * @return {string} Разметка пункта меню фильтра
   */
  _createFilterMarkup(filter, isActive) {
    const {name, count} = filter;
    const activeClass = isActive ? `main-navigation__item--active` : ``;
    const anchorText = name.lower;
    return (
      `<a href="#${anchorText}" class="main-navigation__item ${activeClass}">${name} <span class="main-navigation__item-count">${count}</span></a>`
    );
  }

  getTemplate() {
    const filterMarkup = this._filters.slice(1).map((it) => this._createFilterMarkup(it, false)).join(`\n`);
    const allFilterName = this._filters[0].name;
    return (
      `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">${allFilterName}</a>
        ${filterMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
