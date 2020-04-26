import {RenderPosition} from '../utils/render';
import NoFilms from '../components/no-films';
import FilmsListComponent from '../components/films-list';
import ShowMoreButtonComponent from '../components/show-more-button';
import {SortType} from '../components/sort-menu.js';
import * as appConst from '../const';
import MovieController from './movie';

/** Контроллер списка фильмов */
export default class FilmsBoardController {
  /**
   * @constructor
   * @param {Element} container - Контайнер для списка
   * @param {Element} popupContainer - Контейнер для попапа
   * @param {SortMenuComponent} sortMenuComponent - Компонент меню сортировки
   */
  constructor(container, popupContainer, sortMenuComponent) {
    this._container = container;
    this._popupContainer = popupContainer;

    sortMenuComponent.setSortTypeChangeHandler((sortType) => {
      this.render(this._getSortedFilms(sortType));
    });

    this._films = [];
    this._showedMoviewControllers = [];
    this._showMoreButtonComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  /**
   * Получение отсортированного списка фильмов
   * @param {SortType} sortType - Тип сортировки
   * @return {{}[]} - Массив отсортированных фильмов
   * @private
   */
  _getSortedFilms(sortType) {
    const showingFilms = this.films.slice();
    switch (sortType) {
      case SortType.DATE:
        return showingFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      case SortType.RATING:
        return showingFilms.sort((a, b) => b.rating - a.rating);
    }
    return showingFilms;
  }

  /**
   * Геттер списка фильмов
   * @return {[]} - Список фильмов
   */
  get films() {
    return this._films;
  }

  /**
   * Сеттер списка фильмов
   * @param {{}[]} value - Список фильмов
   */
  set films(value) {
    this._films = value;

    this.render(this.films);
    this.renderTopRated(this.films);
    this.renderMostCommented(this.films);
  }


  /**
   * Генеация и рендеринг контроллеров фильмов
   * @param {Element} container - Контайнер для контроллера
   * @param {{}[]}films - Массив с данными для генерации контроллеров
   * @return {MovieController[]} - Массив с контроллерами фильмов
   * @private
   */
  _renderFilmCards(container, films) {
    return films.map((filmCard) => {
      const movieController = new MovieController(container, this._popupContainer, this._onDataChange, this._onViewChange);

      movieController.render(filmCard);

      return movieController;
    });
  }

  /**
   * Рендеринг списка фильмов
   * @param {{}[]}films - Массив объектов с данными
   */
  render(films) {
    // Если фильмов нет показываем заглушку
    if (films.length === 0) {
      const noFilms = new NoFilms(this._container, RenderPosition.BEFOREEND);
      noFilms.render();
      return;
    }

    // получение контейнера
    if (!this._mainFilmsListComponent) {
      this._mainFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, false, `All movies. Upcoming`);
    } else {
      this._mainFilmsListComponent.clearCardContainer();
    }

    this._showingFilmCardsCount = Math.min(appConst.SHOWING_FILM_CARDS_COUNT_ON_START, films.length);

    if (films.length > appConst.SHOWING_FILM_CARDS_COUNT_ON_START) {
      if (!this._showMoreButtonComponent) {
        // Отрисовка компонента - Кнопка «Show more»
        this._showMoreButtonComponent = new ShowMoreButtonComponent(this._mainFilmsListComponent.getElement(), RenderPosition.BEFOREEND);
      }
      this._showMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = this._showingFilmCardsCount;
        this._showingFilmCardsCount = this._showingFilmCardsCount + appConst.SHOWING_FILM_CARDS_COUNT_BY_BUTTON;
        const newFilmCards = this._renderFilmCards(this._mainFilmsListComponent.cardContainer, films.slice(prevTasksCount, this._showingFilmCardsCount));
        this._showedMoviewControllers = this._showedMoviewControllers.concat(newFilmCards);

        if (this._showingFilmCardsCount >= films.length) {
          this._showMoreButtonComponent.getElement().remove();
          this._showMoreButtonComponent.removeElement();
          this._showMoreButtonComponent = null;
        }
      });
    }

    this._showedMoviewControllers = this._renderFilmCards(this._mainFilmsListComponent.cardContainer, films.slice(0, appConst.SHOWING_FILM_CARDS_COUNT_ON_START));
  }

  /**
   * Рендеринг списка фильмов Top Rated
   * @param {{}[]}films - Массив объектов с данными
   */
  renderTopRated(films) {
    // получение контейнера
    if (!this._topRatedFilmsListComponent) {
      this._topRatedFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, true, `Top rated`);
    } else {
      this._topRatedFilmsListComponent.clearCardContainer();
    }

    let topRatedFilms = films.slice().sort((a, b) => {
      return b.rating - a.rating;
    });

    topRatedFilms = topRatedFilms.slice(0, appConst.EXTRA_FILM_CARDS_COUNT).filter((filmCard) =>{
      return filmCard.rating > 0;
    });

    if (topRatedFilms.length > 0) {
      const newFilmCards = this._renderFilmCards(this._topRatedFilmsListComponent.cardContainer,
          topRatedFilms.slice(0, topRatedFilms.length));
      this._showedMoviewControllers = this._showedMoviewControllers.concat(newFilmCards);
    } else {
      this._topRatedFilmsListComponent.getElement().remove();
      this._topRatedFilmsListComponent.removeElement();
    }
  }

  /**
   * Рендеринг списка фильмов Most Commented
   * @param {{}[]}films - Массив объектов с данными
   */
  renderMostCommented(films) {
    // получение контейнера
    if (!this._mostCommntedFilmsListComponent) {
      this._mostCommntedFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, true, `Most commented`);
    } else {
      this._mostCommntedFilmsListComponent.clearCardContainer();
    }

    let mostCommentedFilms = films.slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    });

    mostCommentedFilms = mostCommentedFilms.slice(0, appConst.EXTRA_FILM_CARDS_COUNT).filter((filmCard) =>{
      return filmCard.comments.length > 0;
    });

    if (mostCommentedFilms.length > 0) {
      const newFilmCards = this._renderFilmCards(this._mostCommntedFilmsListComponent.cardContainer,
          mostCommentedFilms.slice(0, mostCommentedFilms.length));
      this._showedMoviewControllers = this._showedMoviewControllers.concat(newFilmCards);
    } else {
      this._mostCommntedFilmsListComponent.getElement().remove();
      this._mostCommntedFilmsListComponent.removeElement();
    }
  }

  /**
   * Обработчик изменения данных
   * @param {MovieController} movieController
   * @param {{}} oldData - Старые данные
   * @param {{}} newData - Новые данные
   * @private
   */
  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);
    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));
    movieController.render(this._films[index]);
  }

  /**
   * Обработчик изменения отображения
   * @private
   */
  _onViewChange() {
    this._showedMoviewControllers.forEach((it) => it.setDefaultView());
  }
}
