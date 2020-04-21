import AbstractRenderComponent from './abstract-render-component';

/** Компонент статистики фильмов в подвале
 * @extends AbstractRenderComponent
 */
export default class FooterStatisticComponent extends AbstractRenderComponent {
  constructor(container, place) {
    super(container, place);

    this._movieCount = 0;

    this.render();
  }

  getTemplate() {
    const formattedMoviesInside = this._movieCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1 `);
    return (
      `<p>${formattedMoviesInside} movies inside</p>`
    );
  }

  set movieCont(value) {
    this._movieCount = value;
    this.reRender();
  }
}
