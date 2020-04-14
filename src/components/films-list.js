import {createElement} from "../utils.js";

/**
 * Шаблон списка фильмов
 * @param {boolean} isExtra Если true указывает на дополнительный список фильмов
 * @param {string} title Заголовок списка
 * @return {string}
 */
const createFilmsListTemplate = (isExtra, title) => {
  const filmsListClass = isExtra ? `--extra` : ``;
  const filmsListTitleClass = isExtra ? `` : `visually-hidden`;
  return (
    `<section class="films-list${filmsListClass}">
      <h2 class="films-list__title ${filmsListTitleClass}">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class FilmsList {
  constructor(isExtra, title) {
    this._isExtra = isExtra;
    this._title = title;

    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._isExtra, this._title);
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

