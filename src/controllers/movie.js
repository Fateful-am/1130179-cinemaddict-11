import FilmCardComponent from '../components/film-card';
import FilmPopupComponent from '../components/film-popup';
import {RenderPosition} from '../utils/render';


const Mode = {
  DEFAULT: `default`,
  DETAIL: `detail`,
};

/** Контроллер фильма */
export default class MovieController {
  /**
   * @constructor
   * @param {Element} container - Контейнер фильма
   * @param {Element} popupContainer - Контейнер для попапа
   * @param {function} onDataChange - Колбэк функция при изменении данных
   * @param {function} onViewChange - Колбэк функция при изменении отображения
   */
  constructor(container, popupContainer, onDataChange, onViewChange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showPopup = this._showPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  /**
   * Обработчик нажатия клавиш
   * @param {Event} evt - Объект события
   * @private
   */
  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }

  /**
   * Обработчик закрытия попапа
   * @private
   */
  _closePopup() {
    this._popupContainer.removeChild(this._filmPopupComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  /**
   * Обработчик показа попапа
   * @private
   */
  _showPopup() {
    this._onViewChange();
    this._popupContainer.appendChild(this._filmPopupComponent.getElement());
    this._filmPopupComponent.initPopup();
    this._filmPopupComponent.reRender();
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DETAIL;
  }

  /**
   * Отрисовка карточки фильма
   * @param {{}} filmCard - Данные с фильмом
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

    const filmComponents = [this._filmCardComponent, this._filmPopupComponent];

    filmComponents.forEach((it) => {
      it.setAddToWatchListClickHandler(() => {
        this._onDataChange(this, filmCard, Object.assign({}, filmCard, {
          addedToWatchlist: !filmCard.addedToWatchlist,
        }));
      });

      it.setMarkAsWatchedListClickHandler(() => {
        this._onDataChange(this, filmCard, Object.assign({}, filmCard, {
          markedAsWatched: !filmCard.markedAsWatched,
        }));
      });

      it.setFavoriteClickHandler(() => {
        this._onDataChange(this, filmCard, Object.assign({}, filmCard, {
          addedToFavorite: !filmCard.addedToFavorite,
        }));
      });
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

  destroy() {
    this._filmCardComponent.remove();
    this._filmPopupComponent.remove();
    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }


}
