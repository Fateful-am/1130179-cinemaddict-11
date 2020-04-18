import AbstractComponent from "./abstract-component.js";

/** Компонент статистики фильмов в подвале
 * @extends AbstractComponent
 */
export default class FooterStatisticComponent extends AbstractComponent {
  constructor(movieCount) {
    super();

    this._movieCount = movieCount;
  }

  getTemplate() {
    const formattedMoviesInside = this._movieCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1 `);
    return (
      `<p>${formattedMoviesInside} movies inside</p>`
    );
  }
}
