import moment from 'moment';
import AbstractRenderComponent from './abstract-render-component';
import {formatDuration} from '../utils.js';
import {encode} from 'he';

// Типы эмоций
const EmojiType = {
  NONE: ``,
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`
};

/** Компонент детальной карточки фильма
 * @extends AbstractRenderComponent
 */
export default class FilmPopupComponent extends AbstractRenderComponent {
  /**
   * @constructor
   * @param {Element} container - Контейнер для компонента
   * @param {InsertPosition} place - Место вставки компонента
   * @param {Movie} filmCard - Объект с данными фильма
   */
  constructor(container, place, filmCard) {
    super(container, place);

    this._closePopupClickHandler = null;
    this._addToWatchListClickHandler = null;
    this._markAsWatchedListClickHandler = null;
    this._favoriteClickHandler = null;
    this._commentsListClickHandler = null;
    this._filmCard = filmCard;

    this.initPopup();
    this._setAddEmojiClickHandler();
    this._onDeleteCommentButtonClick = this._onDeleteCommentButtonClick.bind(this);
  }

  /**
   * Инициализация компонента
   * @param {boolean} skipScroll - Если true не сбрасывать скролл
   */
  initPopup(skipScroll = false) {
    this._addEmojiType = EmojiType.NONE;
    if (!skipScroll) {
      this._elementScrollTop = 0;
    }
  }

  /**
   * Генерация шаблона для списка эмоций
   * @return {string} - Разметка для списка эмоций
   * @private
   */
  _getEmojiListItemsTemplate() {
    const items = [];
    for (const item in EmojiType) {
      if (EmojiType[item] === EmojiType.NONE) {
        continue;
      }
      if (EmojiType.hasOwnProperty(item)) {
        const itemChecked = this._addEmojiType === EmojiType[item] ? `checked` : ``;

        items.push(
            `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${EmojiType[item]}" value="${EmojiType[item]}" ${itemChecked}>
          <label class="film-details__emoji-label" for="emoji-${EmojiType[item]}">
            <img src="./images/emoji/${EmojiType[item]}.png" width="30" height="30" alt="emoji">
          </label>
           `
        );
      }
    }

    return items.join(`\n`);
  }

  /**
   * Возвращает шаблон отрисовки жанра фильма
   * @param {String} genre - Жанр фильма
   * @return {string} Шаблон жанра фильма
   */
  _createGenreItemTemplate(genre) {
    return `<span class="film-details__genre">${genre}</span>`;
  }

  /**
   * Отрисовывыет все жанры
   * @param {Array} genres - Массив с жанрами фильма
   * @return {string} Шаблон жанров фильма
   */
  _renderGenres(genres) {
    const outArray = [];
    genres.forEach((genre) => {
      outArray.push(this._createGenreItemTemplate(genre));
    });
    return outArray.join(`\n`);
  }

  /**
   * Генерирует шаблон отрисовки комментариев
   * @param {object} comment - Объект с данными комментария
   * @return {string} - Шаблон отрисовки комментариев
   */
  _createCommentItemTemplate(comment) {
    const {id, text: currentText, emoji, author, date} = comment;
    if (!id) {
      return ``;
    }
    const text = encode(currentText);
    return `
    <li class="film-details__comment" data-comment-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${moment(date).fromNow()}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
        </p>
      </div>
    </li>`;
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
    const {title, originTitle, rating, director, writers, actors, releaseDate, duration, country,
      genres, poster, description, comments, age, addedToWatchlist, markedAsWatched, addedToFavorite} = this._filmCard;
    const genreSuffix = genres.length === 1 ? `` : `s`;
    const releaseDateString = moment(releaseDate).format(`DD MMMM YYYY`);
    const genresString = this._renderGenres(genres);
    const commentsString = this._renderComments(comments);
    let filmDetailsCommentsCount = comments.length;
    if (comments.length > 0) {
      const {id: serverCommentId, commentId} = comments[0];
      if (!serverCommentId && commentId) {
        filmDetailsCommentsCount = comments[0].text;
      }
    }

    const addedToWatchlistChecked = addedToWatchlist ? `checked` : ``;
    const markedAsWatchedChecked = markedAsWatched ? `checked` : ``;
    const addedToFavoriteChecked = addedToFavorite ? `checked` : ``;
    const formattedDuration = formatDuration(duration);
    const emojiList = this._getEmojiListItemsTemplate();
    const addEmoji = this._addEmojiType !== EmojiType.NONE ? `<img src="./images/emoji/${this._addEmojiType}.png" width="55" height="55" alt="emoji-smile">` : ``;

    return (
      `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">
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
                  <td class="film-details__cell">${formattedDuration}</td>
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
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${addedToWatchlistChecked}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${markedAsWatchedChecked}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${addedToFavoriteChecked}>
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
              <div class="film-details__add-emoji-label">
                ${addEmoji}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emojiList}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
    );
  }

  /**
   * Устанавливает обработчик клика по эмоциям
   * @private
   */
  _setAddEmojiClickHandler() {
    const addEmojiList = this.getElement().querySelector(`.film-details__emoji-list`);
    addEmojiList.addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._addEmojiType = evt.target.value;
      this._elementScrollTop = this.getElement().scrollTop;

      const currentComment = this.getData().comment;
      this.reRender();
      this.getElement().querySelector(`.film-details__comment-input`).value = currentComment;
    });
  }

  /**
   * Устанавливает обработчик клика по кнопке
   * @param {function} handler - КоллБэк-функция
   */
  setClosePopupClickHandler(handler) {
    this._closePopupClickHandler = handler;

    const popupCloseButton = this.getElement().querySelector(`.film-details__close-btn`);
    popupCloseButton.addEventListener(`click`, handler);
  }

  /**
   * Установка обработчика для инпута "Add to watchlist"
   * @param {function} handler - Коллбэк функция по нажатию на инпут
   */
  setAddToWatchListClickHandler(handler) {
    this._addToWatchListClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, () => {
        // this._elementScrollTop = this.getElement().scrollTop;
        handler();
      });
  }

  /**
   * Установка обработчика для инпута "Mark as watched"
   * @param {function} handler - Коллбэк функция по нажатию на инпут
   */
  setMarkAsWatchedListClickHandler(handler) {
    this._markAsWatchedListClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, () => {
        // this._elementScrollTop = this.getElement().scrollTop;
        handler();
      });
  }

  /**
   * Установка обработчика для инпута "Favorite"
   * @param {function} handler - Коллбэк функция по нажатию на инпут
   */
  setFavoriteClickHandler(handler) {
    this._favoriteClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        // this._elementScrollTop = this.getElement().scrollTop;
        handler();
      });
  }

  /**
   * Обработчик клика по списку комментариев
   * @param {Event} evt - Объект события
   * @private
   */
  _onDeleteCommentButtonClick(evt) {
    if (evt.target.tagName !== `BUTTON`) {
      return;
    }
    evt.preventDefault();
    this._elementScrollTop = this.getElement().scrollTop;
    evt.target.innerText = `Deleting...`;
    evt.target.disabled = true;
    this._commentsListClickHandler(evt.target.dataset.commentId);
  }

  /**
   * Установка обработчика клика при удалении комментария
   * @param {function} handler - Коллбэк функция при удалении комментария
   */
  setCommentsListClickHandler(handler) {
    this._commentsListClickHandler = handler;
    const commentsList = this.getElement().querySelector(`.film-details__comments-list`);
    commentsList.removeEventListener(`click`, this._onDeleteCommentButtonClick);
    commentsList.addEventListener(`click`, this._onDeleteCommentButtonClick);
  }

  recoveryListeners() {
    this.setClosePopupClickHandler(this._closePopupClickHandler);
    this.setAddToWatchListClickHandler(this._addToWatchListClickHandler);
    this.setMarkAsWatchedListClickHandler(this._markAsWatchedListClickHandler);
    this.setFavoriteClickHandler(this._favoriteClickHandler);
    this.setCommentsListClickHandler(this._commentsListClickHandler);
    this._setAddEmojiClickHandler();

  }

  reRender(filmCard) {
    if (filmCard) {
      this._filmCard = filmCard;
    }
    super.reRender();
    this.getElement().scrollTop = this._elementScrollTop;
  }

  /**
   * Устанавливает текущий объект с данными о фильме
   * @param {Movie} filmCard - Объект с данными о фильме
   */
  setFilmCard(filmCard) {
    this._filmCard = filmCard;
  }

  /**
   * Получение данных формы
   * @param {boolean} disableElements - Блокировать ли элементы формы
   * @return {{emoji: FormDataEntryValue, oldMovieData: Object, comment: FormDataEntryValue}}
   */
  getData(disableElements = false) {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);
    const data = {
      comment: formData.get(`comment`),
      emoji: formData.get(`comment-emoji`),
      oldMovieData: this._filmCard
    };
    if (disableElements && data.comment && data.emoji) {
      form.querySelector(`.film-details__comment-input`).style = ``;
      form.querySelectorAll(`input, textarea, button`).forEach((elem) => {
        elem.disabled = true;
      });
    }
    return data;
  }


}
