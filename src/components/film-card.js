import {MAX_DESCRIPTION_LENGTH} from '../const.js';
import AbstractRenderComponent from './abstract-render-component';


const ITEM_ACTIVE_CLASS = `film-card__controls-item--active`;

/** Компонент карточки фильма
 * @extends AbstractComponent
 */
export default class FilmCardComponent extends AbstractRenderComponent {
  constructor(container, place, filmCard) {
    super(container, place);
    this._filmCard = filmCard;

    this._showPopupClickHandler = null;
    this._clickListeners = {};
    this.render();
  }

  getTemplate() {
    const {title, rating, releaseDate, duration, genres, poster, description, comments, addedToWatchlist, markedAsWatched, addedToFavorite} = this._filmCard;

    const addToWatchlistActiveClass = addedToWatchlist ? ITEM_ACTIVE_CLASS : ``;
    const markAsWatchedActiveClass = markedAsWatched ? ITEM_ACTIVE_CLASS : ``;
    const favoriteActiveClass = addedToFavorite ? ITEM_ACTIVE_CLASS : ``;
    const commentsCount = comments.length === 0 ? `No` : comments.length;
    const commentsSuffix = comments.length === 1 ? `` : `s`;
    const shortDescription = description.length > MAX_DESCRIPTION_LENGTH ? `${description.substr(0, MAX_DESCRIPTION_LENGTH - 1)}…` : description;
    const filmCardYear = releaseDate.getFullYear();
    const filmCardGenre = genres.split(` `)[0];

    return (
      `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${filmCardYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${filmCardGenre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comment${commentsSuffix}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${addToWatchlistActiveClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${markAsWatchedActiveClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteActiveClass}">Mark as favorite</button>
      </form>
    </article>`
    );
  }
  /**
   * Устанавливает обработчик клика по элементам
   * @param {function} handler - КоллБэк-функция
   */
  setShowPopupClickHandler(handler) {
    this._showPopupClickHandler = handler;
    // метод назначения клика по объекту для вызова попапа
    const addClickListener = (...rest) => {
      rest.forEach((it) => it.addEventListener(`click`, handler));
    };

    // Элементы по клику которым вызывается попап форма
    const filmCardPoster = this.getElement().querySelector(`.film-card__poster`);
    const filmCardTitle = this.getElement().querySelector(`.film-card__title`);
    const filmCardComments = this.getElement().querySelector(`.film-card__comments`);

    // Назначение клика
    addClickListener(filmCardPoster, filmCardTitle, filmCardComments);
  }

  _setButtonClickHandler(button, handler) {
    const buttonClass = button.classList.item(2);
    if (this._clickListeners[buttonClass]) {
      button.removeEventListener(`click`, this._clickListeners[buttonClass]);
    }

    this._clickListeners[buttonClass] = (evt) => {
      evt.preventDefault();
      button.classList.toggle(ITEM_ACTIVE_CLASS);
      handler();
    };
    button.addEventListener(`click`, this._clickListeners[buttonClass]);
  }

  setAddToWatchListClickHandler(handler) {
    this._setButtonClickHandler(this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`), handler);
  }

  setMarkAsWatchedListClickHandler(handler) {
    this._setButtonClickHandler(this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`), handler);
  }

  setFavoriteClickHandler(handler) {
    this._setButtonClickHandler(this.getElement().querySelector(`.film-card__controls-item--favorite`), handler);
  }

  recoveryListeners() {
    this.setShowPopupClickHandler(this._showPopupClickHandler);
  }

  reRender(filmCard) {
    this._filmCard = filmCard;
    super.reRender();
  }

}

