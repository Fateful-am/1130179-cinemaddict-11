import {createElement} from "../utils.js";

export default class FooterStatisticComponent {
  constructor(movieCount) {
    this._movieCount = movieCount;

    this._element = null;
  }

  getTemplate() {
    const formattedMoviesInside = this._movieCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1 `);
    return (
      `<p>${formattedMoviesInside} movies inside</p>`
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
