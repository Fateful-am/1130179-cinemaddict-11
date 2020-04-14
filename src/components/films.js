import {createFilmsListTemplate} from './films-list.js';
import {createElement} from "../utils.js";

/**
 * Компонент - Контент-контейнер
 * @return {string}
 */
const createFilmsTemplate = () => {
  const filmsList = createFilmsListTemplate(false, `All movies. Upcoming`);
  return (
    `<section class="films">
      ${filmsList}
    </section>`
  );
};

export default class FilmsBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsTemplate();
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
