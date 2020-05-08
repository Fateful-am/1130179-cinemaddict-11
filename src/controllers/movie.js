import FilmCardComponent from '../components/film-card';
import FilmPopupComponent from '../components/film-popup';
import {RenderPosition} from '../utils/render';
import Movie from '../models/movie.js';

/**
 * Режим просмотра
 * @type {{DETAIL: string, DEFAULT: string}}
 */
export const Mode = {
  DEFAULT: `default`,
  DETAIL: `detail`,
};

/**
 * Время работы анимации
 * @type {number}
 */
export const SHAKE_ANIMATION_TIMEOUT = 600;

/** Контроллер фильма */
export default class MovieController {
  /**
   * @constructor
   * @param {Element} container - Контейнер фильма
   * @param {Element} popupContainer - Контейнер для попапа
   * @param {String} movieId - Id фильма
   * @param {function} onDataChange - Колбэк функция при изменении данных
   * @param {function} onViewChange - Колбэк функция при изменении отображения
   */
  constructor(container, popupContainer, movieId, onDataChange, onViewChange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this.movieId = movieId;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._forceRender = false;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showPopup = this._showPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this.rerenderPopupComponent = this.rerenderPopupComponent.bind(this);
  }

  /**
   * Геттер попап-компонента
   * @return {FilmPopupComponent} - Компонент попапа
   */
  get filmPopupComponent() {
    return this._filmPopupComponent;
  }

  /**
   * Переключает класс активности кнопки управления
   * @param {String} buttonClass - Класс кнопки
   */
  toggleFilmCardButtonClass(buttonClass) {
    this._filmCardComponent.getElement().querySelector(`.film-card__controls-item--${buttonClass}`)
      .classList.toggle(`film-card__controls-item--active`);
  }

  /**
   * Устанавливает анимацию "Трясучка" для элемента
   * @param {Element} element - Элемент для "трясусучки"
   * @private
   */
  _shakeElement(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  /**
   * Установка анимации "трясучка"  при неудачном сетевом взаимодействии
   * @param {String} commentId - Id комментария
   * @param {boolean} whenCreating - Ошибка при создании комментария
   */
  shake(commentId, whenCreating = false) {
    if (commentId) {
      this._shakeElement(this._filmPopupComponent.getElement().querySelector(`.film-details__comment[data-comment-id="${commentId}"]`));
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      this._shakeElement(this._filmCardComponent.getElement());
      return;
    }
    if (whenCreating) {
      this._shakeElement(this._filmPopupComponent.getElement().querySelector(`.film-details__new-comment`));
      return;
    }
    this._shakeElement(this._filmPopupComponent.getElement());
  }

  /**
   * Обработчик нажатия клавиш
   * @param {Event} evt - Объект события
   * @private
   */
  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    const isCtrlEnter = evt.key === `Enter` && evt.ctrlKey;
    if (isEscKey) {
      this._closePopup();
      return;
    }

    // Отправка формы с новым комментарием
    if (isCtrlEnter) {
      const formData = this._filmPopupComponent.getData(true);
      if (formData.comment && formData.emoji) {
        const comments = [].concat(formData.oldMovieData.comments, {
          id: String(new Date() + Math.random()),
          text: formData.comment,
          emoji: formData.emoji,
          author: `Myself`,
          date: new Date()
        });
        this._onDataChange(this, formData.oldMovieData, Object.assign({}, formData.oldMovieData, {comments}));
      }
    }
  }

  /**
   * Обработчик закрытия попапа
   * @private
   */
  _closePopup() {
    this._popupContainer.removeChild(this._filmPopupComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._onViewChange(Mode.DEFAULT);
    this._mode = Mode.DEFAULT;
  }

  /**
   * Обработчик показа попапа
   * @private
   */
  _showPopup() {
    this._onViewChange(Mode.DETAIL, this);
    this._popupContainer.appendChild(this._filmPopupComponent.getElement());
    this._filmPopupComponent.initPopup();
    this.rerenderPopupComponent();
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DETAIL;
  }

  /**
   * Перерисовка папапа
   * @param {Movie} movie - Данные с фильмом для перересовки
   */
  rerenderPopupComponent(movie) {
    this._filmPopupComponent.reRender(movie);
  }

  /**
   * Отрисовка карточки фильма
   * @param {Movie} filmCard - Данные с фильмом
   */
  render(filmCard) {
    if (!this._filmCardComponent) {
      this._filmCardComponent = new FilmCardComponent(this._container, RenderPosition.BEFOREEND, filmCard);
      this._filmCardComponent.setShowPopupClickHandler(this._showPopup);

      this._filmPopupComponent = new FilmPopupComponent(this._popupContainer, RenderPosition.BEFOREEND, filmCard);
      this._filmPopupComponent.setClosePopupClickHandler(this._closePopup);

    } else {
      if (this._mode === Mode.DETAIL) {
        this._filmCardComponent.reRender(filmCard);
        this._filmPopupComponent.reRender(filmCard);
      } else {
        this._filmPopupComponent.setFilmCard(filmCard);
      }
    }

    if (this._forceRender) {
      this._filmCardComponent.reRender(filmCard);
    }

    const filmComponents = [this._filmCardComponent, this._filmPopupComponent];

    filmComponents.forEach((it) => {
      it.setAddToWatchListClickHandler(() => {
        const newMovie = Movie.clone(filmCard);
        newMovie.addedToWatchlist = !newMovie.addedToWatchlist;
        this._onDataChange(this, filmCard, newMovie);
      });

      it.setMarkAsWatchedListClickHandler(() => {
        const newMovie = Movie.clone(filmCard);
        newMovie.markedAsWatched = !newMovie.markedAsWatched;
        newMovie.watchingDate = filmCard.markedAsWatched ? null : new Date();
        this._onDataChange(this, filmCard, newMovie);
      });

      it.setFavoriteClickHandler(() => {
        const newMovie = Movie.clone(filmCard);
        newMovie.addedToFavorite = !newMovie.addedToFavorite;
        this._onDataChange(this, filmCard, newMovie);
      });
    });

    this._filmPopupComponent.setCommentsListClickHandler((commentId) => {
      const index = filmCard.comments.findIndex((it) => it.id === commentId);
      const comments = [].concat(filmCard.comments.slice(0, index), filmCard.comments.slice(index + 1));
      const newMovie = Movie.clone(filmCard);

      newMovie.comments = comments;

      this._onDataChange(this, filmCard, newMovie);
    });
  }

  /**
   * Установка вида по умолчанию
   */
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  /**
   * Сеттер принудительной перересовки контроллера
   * @param {boolean} value - Флаг принудительной перересовки контроллера
   */
  set forceRender(value) {
    this._forceRender = value;
  }

  /**
   * Деструктор контроллера
   */
  destroy() {
    this._filmCardComponent.remove();
    this._filmPopupComponent.remove();
    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }


}
