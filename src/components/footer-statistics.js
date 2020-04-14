import {createElement} from "../utils.js";

/**
 * Компонент - Количество фильмов
 * @param {number} movieCount количество фильмов в библиотеке
 * @return {string}
 */
const createFooterStatisticsTemplate = (movieCount) => {
  return (
    `<p>${movieCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1 `)} movies inside</p>`
  );
};

export default class FooterStatistic {
  constructor(movieCount) {
    this._movieCount = movieCount;

    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._movieCount);
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
