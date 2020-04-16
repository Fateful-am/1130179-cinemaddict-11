import {createElement} from "../utils.js";

export default class FilmsListComponent {
  constructor(isExtra, header) {
    this._isExtra = isExtra;
    this._header = header;

    this._element = null;
  }

  getTemplate() {
    const [filmsListClass, filmsListTitleClass] = this._isExtra ? [`--extra`, ``] : [``, `visually-hidden`];
    const filmsListHeader = this._header;
    return (
      `<section class="films-list${filmsListClass}">
      <h2 class="films-list__title ${filmsListTitleClass}">${filmsListHeader}</h2>
      <div class="films-list__container">
      </div>
    </section>`
    );
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

