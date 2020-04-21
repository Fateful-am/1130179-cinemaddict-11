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

  _renderFilmCards(container, films, fromIndex, toIndex) {
    films.slice(fromIndex, toIndex).forEach((filmCard) => {
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
      // компонент карточек фильма
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
      return;
    }

    // получение контейнера
    if (!this._mainFilmsListComponent) {
      this._mainFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, false, `All movies. Upcoming`);
    } else {
      while (this._mainFilmsListComponent.cardContainer.firstChild) {
        this._mainFilmsListComponent.cardContainer.removeChild(this._mainFilmsListComponent.cardContainer.firstChild);
      }
    }

    this._showingFilmCardsCount = appConst.SHOWING_FILM_CARDS_COUNT_ON_START;

    if (films.length > appConst.SHOWING_FILM_CARDS_COUNT_ON_START) {
      // Отрисовка компонента - Кнопка «Show more»
      const showMoreButtonComponent = new ShowMoreButtonComponent(this._mainFilmsListComponent.getElement(), RenderPosition.BEFOREEND);
      showMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = this._showingFilmCardsCount;
        this._showingFilmCardsCount = this._showingFilmCardsCount + appConst.SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

        this._renderFilmCards(this._mainFilmsListComponent.cardContainer, this._films, prevTasksCount, this._showingFilmCardsCount);

        if (this._showingFilmCardsCount >= films.length) {
          showMoreButtonComponent.getElement().remove();
        }
      });
    }

    this._renderFilmCards(this._mainFilmsListComponent.cardContainer, this._films, 0, appConst.SHOWING_FILM_CARDS_COUNT_ON_START);
  }

  renderTopRated(films) {
    // получение контейнера
    if (!this._topRatedFilmsListComponent) {
      this._topRatedFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, true, `Top rated`);
    } else {
      while (this._topRatedFilmsListComponent.cardContainer.firstChild) {
        this._topRatedFilmsListComponent.cardContainer.removeChild(this._topRatedFilmsListComponent.cardContainer.firstChild);
      }
    }

    let topRatedFilms = films.slice().sort((a, b) => {
      return b.rating - a.rating;
    });

    topRatedFilms = topRatedFilms.slice(0, 2).filter((filmCard) =>{
      return filmCard.rating > 0;
    });

    if (topRatedFilms.length > 0) {
      this._renderFilmCards(this._topRatedFilmsListComponent.cardContainer, topRatedFilms, 0, topRatedFilms.length);
    } else {
      this._topRatedFilmsListComponent.getElement().remove();
      this._topRatedFilmsListComponent.removeElement();
    }
  }

  renderMostCommented(films) {
    // получение контейнера
    if (!this._mostCommntedFilmsListComponent) {
      this._mostCommntedFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, true, `Most commented`);
    } else {
      while (this._mostCommntedFilmsListComponent.cardContainer.firstChild) {
        this._mostCommntedFilmsListComponent.cardContainer.removeChild(this._mostCommntedFilmsListComponent.cardContainer.firstChild);
      }
    }

    let mostCommentedFilms = films.slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    });

    mostCommentedFilms = mostCommentedFilms.slice(0, 2).filter((filmCard) =>{
      return filmCard.comments.length > 0;
    });

    if (mostCommentedFilms.length > 0) {
      this._renderFilmCards(this._mostCommntedFilmsListComponent.cardContainer, mostCommentedFilms, 0, mostCommentedFilms.length);
    } else {
      this._mostCommntedFilmsListComponent.getElement().remove();
      this._mostCommntedFilmsListComponent.removeElement();
    }
  }
}
