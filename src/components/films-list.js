import {createElement} from "../utils.js";

/**
 * Шаблон списка фильмов
 * @param {boolean} isExtra Если true указывает на дополнительный список фильмов
 * @param {string} header Заголовок списка
 * @return {string}
 */
const createFilmsListTemplate = (isExtra, header) => {
  const filmsListClass = isExtra ? `--extra` : ``;
  const filmsListTitleClass = isExtra ? `` : `visually-hidden`;
  return (
    `<section class="films-list${filmsListClass}">
      <h2 class="films-list__title ${filmsListTitleClass}">${header}</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class FilmsListComponent {
  constructor(isExtra, header) {
    this._isExtra = isExtra;
    this._header = header;

    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._isExtra, this._header);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this.cardContainer = this._element.querySelector(`.films-list__container`);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

