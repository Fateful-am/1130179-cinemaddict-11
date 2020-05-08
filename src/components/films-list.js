import AbstractRenderComponent from './abstract-render-component';

/** Компонент списка фильмов
 * @extends AbstractRenderComponent
 */
export default class FilmsListComponent extends AbstractRenderComponent {
  /**
   * @constructor
   * @param {Element} container - Контайнер для компонента
   * @param {InsertPosition} place - Место вставки компонента
   * @param {Boolean} isExtra - Флаг списка, если true - создается дополнительный контейнер
   * @param {String} header - Заголовок списка
   * @param {Boolean} isNoMovies - Флаг заглушки при отсутствии фильмов
   */
  constructor(container, place, isExtra, header, isNoMovies = false) {
    super(container, place);

    this._isExtra = isExtra;
    this._header = header;
    this._isNoMovies = isNoMovies;

    this.render();
  }

  getTemplate() {
    let [filmsListClass, filmsListTitleClass] = this._isExtra ? [`--extra`, ``] : [``, `visually-hidden`];
    const filmsListHeader = this._header;
    let makeFilmListContainer = true;
    [filmsListTitleClass, makeFilmListContainer] = this._isNoMovies ? [``, false] : [filmsListTitleClass, makeFilmListContainer];
    const filmListContainer = makeFilmListContainer ? `<div class="films-list__container"> </div>` : ``;
    return (
      `<section class="films-list${filmsListClass}">
      <h2 class="films-list__title ${filmsListTitleClass}">${filmsListHeader}</h2>
      ${filmListContainer}
    </section>`
    );
  }

  /**
   * Получение контейнера для отрисовки карточек фильмов
   * @return {Element} - Элемент контейнер для отрисовки карточек фильмов
   */
  get cardContainer() {
    if (!this._cardContainer) {
      this._cardContainer = this._element.querySelector(`.films-list__container`);
    }

    return this._cardContainer;
  }

  recoveryListeners() {}
}

