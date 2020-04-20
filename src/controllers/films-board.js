import {RenderPosition} from '../utils/render';
import NoFilms from '../components/no-films';
import FilmsListComponent from '../components/films-list';
import ShowMoreButtonComponent from '../components/show-more-button';
import FilmCardComponent from '../components/film-card';
import FilmPopupComponent from '../components/film-popup';
import * as appConst from '../const';

export default class FilmsBoardController {
  constructor(container, popupContainer) {
    this._container = container;
    this._popupContainer = popupContainer;
  }

  _renderFilmCards(container, fromIndex, toIndex) {
    this._films.slice(fromIndex, toIndex).forEach((filmCard) => {
      // Обработчик закрытия попапа
      const closePopup = () => {
        this._popupContainer.removeChild(filmPopupCardComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      };

      // Обработчик показа попапа
      const showPopup = () => {
        this._popupContainer.appendChild(filmPopupCardComponent.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      };

      const onEscKeyDown = (evt) => {
        const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

        if (isEscKey) {
          closePopup();
        }
      };
      // компонент карточув фильма
      const filmCardComponent = new FilmCardComponent(container, RenderPosition.BEFOREEND, filmCard);
      filmCardComponent.setClickHandler(showPopup);

      // компонент - попап
      const filmPopupCardComponent = new FilmPopupComponent(container, RenderPosition.BEFOREEND, filmCard);
      filmPopupCardComponent.setClickHandler(closePopup);
    });
  }

  render(films) {
    this._films = films;

    if (this._films.length === 0) {
      const noFilms = new NoFilms(this._container, RenderPosition.BEFOREEND);
      noFilms.render();
    }

    // получение контейнера
    if (!this._mainFilmsListComponent) {
      this._mainFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, false, `All movies. Upcoming`);
    } else {
      while (this._mainFilmsListComponent.firstChild) {
        this._mainFilmsListComponent.removeChild(this._mainFilmsListComponent.firstChild);
      }
    }

    this._showingFilmCardsCount = appConst.SHOWING_FILM_CARDS_COUNT_ON_START;

    if (films.length > appConst.SHOWING_FILM_CARDS_COUNT_ON_START) {
      // Отрисовка компонента - Кнопка «Show more»
      const showMoreButtonComponent = new ShowMoreButtonComponent(this._mainFilmsListComponent.getElement(), RenderPosition.BEFOREEND);

      // Событие клика по кнопке
      showMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = this._showingFilmCardsCount;
        this._showingFilmCardsCount = this._showingFilmCardsCount + appConst.SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

        this._renderFilmCards(this._mainFilmsListComponent.cardContainer, prevTasksCount, this._showingFilmCardsCount);

        if (this._showingFilmCardsCount >= films.length) {
          showMoreButtonComponent.getElement().remove();
        }
      });
    }

    this._renderFilmCards(this._mainFilmsListComponent.cardContainer, 0, appConst.SHOWING_FILM_CARDS_COUNT_ON_START);
  }
}
