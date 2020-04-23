import FilmCardComponent from '../components/film-card';
import FilmPopupComponent from '../components/film-popup';
import {RenderPosition} from '../utils/render';

export default class MovieController {
  constructor(container, popupContainer) {
    this._container = container;
    this._popupContainer = popupContainer;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
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
      this._filmPopupComponent = null;

      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    // Обработчик показа попапа
    const showPopup = () => {
      // показывать только если раньше не был показан
      if (!this._filmPopupComponent) {
        this._filmPopupComponent = new FilmPopupComponent(this._popupContainer, RenderPosition.BEFOREEND, filmCard);
        this._filmPopupComponent.setClosePopupClickHandler(closePopup);

        this._popupContainer.appendChild(this._filmPopupComponent.getElement());

        document.addEventListener(`keydown`, onEscKeyDown);
      }
    };


    if (!this._filmCardComponent) {
      this._filmCardComponent = new FilmCardComponent(this._container, RenderPosition.BEFOREEND, filmCard);

      this._filmCardComponent.setShowPopupClickHandler(showPopup);
    } else {
      this._filmCardComponent.reRender(filmCard);

      if (this._filmPopupComponent) {
        this._filmPopupComponent.reRender(filmCard);
      }
    }

  }
}
