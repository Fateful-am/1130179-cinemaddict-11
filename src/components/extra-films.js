import FilmsListComponent from './films-list.js';
import {createElement} from "../utils.js";

/**
 * Компонент - Экстра контент-контейнер
 * @param {String} header заголовок блока
 * @return {string}
 */
const createExtraFilmsTemplate = (header) => {
  const filmsList = new FilmsListComponent(true, header).getTemplate();
  return (
    `${filmsList}`
  );
};

export default class ExtraFilmsBoardComponent {
  constructor(header) {
    this._header = header;

    this._element = null;
  }

  getTemplate() {
    return createExtraFilmsTemplate(this._header);
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
