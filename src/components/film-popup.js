import {formatDateDDMMMMYYYY} from '../utils.js';
import AbstractRenderComponent from './abstract-render-component';

/** Компонент детальной карточки фильма
 * @extends AbstractComponent
 */
export default class FilmPopupComponent extends AbstractRenderComponent {
  constructor(container, place, filmCard) {
    super(container, place);

    this._clickHandler = null;
    this._filmCard = filmCard;
  }

  /**
   * Возвращает шаблон отрисовки комментариев
   * @param {object} comment
   * @return {string}
   */
  _createCommentItemTemplate(comment) {
    const {text, emoji, author, date} = comment;
    return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  }

  /**
   * Возвращает шаблон отрисовки жакра фильма
   * @param {String} genre
   * @return {string}
   */
  _createGenreItemTemplate(genre) {
    return `<span class="film-details__genre">${genre}</span>`;
  }

  /**
   * Отрисовывыет все жанры
   * @param {Array} genres
   * @return {string}
   */
  _renderGenres(genres) {
    const outArray = [];
    genres.forEach((genre) => {
      outArray.push(this._createGenreItemTemplate(genre));
    });
    return outArray.join(`\n`);
  }

  /**
   * Отрисовывает все комментарии
   * @param {Array} comments
   * @return {string}
   */
  _renderComments(comments) {
    const outArray = [];
    comments.forEach((comment) => {
      outArray.push(this._createCommentItemTemplate(comment));
    });
    return outArray.join(`\n`);
  }

  getTemplate() {
    const {title, originTitle, rating, director, writers, actors, releaseDate, duration, country, genres, poster, description, comments, age} = this._filmCard;
    const genreSuffix = genres.split(` `).length === 1 ? `` : `s`;
    const releaseDateString = formatDateDDMMMMYYYY(releaseDate);
    const genresString = this._renderGenres(genres.split(` `));
    const commentsString = this._renderComments(comments);
    const filmDetailsCommentsCount = comments.length;

    return (
      `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
              <p class="film-details__age">${age}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originTitle}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDateString}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${genreSuffix}</td>
                  <td class="film-details__cell">
                    ${genresString}
                </tr>
              </table>
              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmDetailsCommentsCount}</span></h3>
            <ul class="film-details__comments-list">
              ${commentsString}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
    );
  }
  /**
   * Устанавливает обработчик клика по кнопке
   * @param {function} handler - КоллБэк-функция
   */
  setClickHandler(handler) {
    this._clickHandler = handler;

    // Кнопка закрытия попапа и назначение обработчика клика по ней
    const popupCloseButton = this.getElement().querySelector(`.film-details__close-btn`);
    popupCloseButton.addEventListener(`click`, handler);
  }

  recoveryListeners() {
    this.setClickHandler(this._clickHandler);
  }

  reRender(filmCard) {
    this._filmCard = filmCard;
    super.reRender();
  }
}
