import AbstractRenderComponent from './abstract-render-component';

/** Компонент списка фильмов
 * @extends AbstractRenderComponent
 */
export default class FilmsListComponent extends AbstractRenderComponent {
  constructor(container, place, isExtra, header) {
    super(container, place);

    this._isExtra = isExtra;
    this._header = header;

    this.render();
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

  get cardContainer() {
    if (!this._cardContainer) {
      this._cardContainer = this._element.querySelector(`.films-list__container`);
    }

    return this._cardContainer;
  }

  recoveryListeners() {}
}

