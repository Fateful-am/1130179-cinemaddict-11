import {MAX_DESCRIPTION_LENGTH} from '../const.js';
import AbstractRenderComponent from './abstract-render-component';

/** Компонент карточки фильма
 * @extends AbstractComponent
 */
export default class FilmCardComponent extends AbstractRenderComponent {
  constructor(container, place, filmCard) {
    super(container, place);
    this._filmCard = filmCard;

    this.render();
  }

  getTemplate() {
    const {title, rating, releaseDate, duration, genres, poster, description, comments, addedToWatchlist, markedAsWatched, addedToFavorite} = this._filmCard;

    const ITEM_ACTIVE_CLASS = `film-card__controls-item--active`;
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
}

