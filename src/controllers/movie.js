import FilmCardComponent from '../components/film-card';
import FilmPopupComponent from '../components/film-popup';
import {RenderPosition} from '../utils/render';

export default class MovieController {
  constructor(container, popupContainer, onDataChange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._onDataChange = onDataChange;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._popupShowing = false;
  }

  render(filmCard) {
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        closePopup();
      }
    };

    // Обработчик закрытия попапа
    const closePopup = () => {
      this._popupContainer.removeChild(this._filmPopupComponent.getElement());
      this._popupShowing = false;
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    // Обработчик показа попапа
    const showPopup = () => {
      this._popupContainer.appendChild(this._filmPopupComponent.getElement());
      this._filmPopupComponent.initPopup();
      this._filmPopupComponent.reRender();
      this._popupShowing = true;
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    if (!this._filmCardComponent) {
      this._filmCardComponent = new FilmCardComponent(this._container, RenderPosition.BEFOREEND, filmCard);
      this._filmCardComponent.setShowPopupClickHandler(showPopup);

      this._filmPopupComponent = new FilmPopupComponent(this._popupContainer, RenderPosition.BEFOREEND, filmCard);
      this._filmPopupComponent.setClosePopupClickHandler(closePopup);

    } else {
      this._filmCardComponent.reRender(filmCard);
      if (this._popupShowing) {
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
}
