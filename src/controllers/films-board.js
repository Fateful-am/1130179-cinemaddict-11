import {RenderPosition} from '../utils/render';
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
   * @param {Movies} moviesModel - Модель с фильмами
   */
  constructor(container, popupContainer, sortMenuComponent, moviesModel) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._moviesModel = moviesModel;

    sortMenuComponent.setSortTypeChangeHandler((sortType) => {
      this.render(this._getSortedFilms(sortType));
    });

    this._mainFilmsListComponent = null;
    this._topRatedFilmsListComponent = null;
    this._mostCommntedFilmsListComponent = null;
    this._showMoreButtonComponent = null;

    this._showedMainMovieControllers = [];
    this._showedTopRatedMoviewControllers = [];
    this._showedMostCommentedMoviewControllers = [];
    this._reset();

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
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
   * Генеация и рендеринг контроллеров фильмов
   * @param {Element} container - Контайнер для компонента фильма
   * @param {{}[]} movies - Массив с данными для генерации контроллеров фильмов
   * @return {MovieController[]} - Массив с контроллерами фильмов
   * @private
   */
  _renderFilmCards(container, movies) {
    return movies.map((movie) => {
      const movieController = new MovieController(container, this._popupContainer, this._onDataChange, this._onViewChange);

      movieController.render(movie);

      return movieController;
    });
  }

  /**
   * Сброс показанных контроллеров
   * @param {[MovieController]} showedMovieControllers - массив отрисованных контроллеров фильмов
   * @private
   */
  _resetShowedMovieControllers(showedMovieControllers) {
    showedMovieControllers.forEach((movieController) => {
      movieController.destroy();
    });
    showedMovieControllers.length = 0;
  }

  /**
   * Приводит контроллер списка фильмов в первоначальное состояние
   * @private
   */
  _reset() {
    this._resetShowedMovieControllers(this._showedMainMovieControllers);

    // Удаляет кнопку "Show More"
    if (this._showMoreButtonComponent) {
      this._showMoreButtonComponent.remove();
      this._showMoreButtonComponent = null;
    }

    // Удаляет список основных фильмов
    if (this._mainFilmsListComponent) {
      this._mainFilmsListComponent.remove();
      this._mainFilmsListComponent = null;
    }

    // сброс экстра списков
    this._resetTopRated();
    this._resetMostCommented();
  }

  /**
   * Сбрасывает секцию "Top Rated"
    * @private
   */
  _resetTopRated() {
    this._resetShowedMovieControllers(this._showedTopRatedMoviewControllers);

    if (this._topRatedFilmsListComponent) {
      this._topRatedFilmsListComponent.remove();
      this._topRatedFilmsListComponent = null;
    }
  }

  /**
   * Сбрасывает секцию "Most Commented"
   * @private
   */
  _resetMostCommented() {
    this._resetShowedMovieControllers(this._showedMostCommentedMoviewControllers);

    if (this._mostCommntedFilmsListComponent) {
      this._mostCommntedFilmsListComponent.remove();
      this._mostCommntedFilmsListComponent = null;
    }
  }

  /**
   * Изначальный рендеринг списка фильмов
   */
  render() {
    this._reset();

    const movies = this._moviesModel.getMovies();

    // Если фильмов нет - показываем заглушку
    if (movies.length === 0) {
      this._mainFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, false, `There are no movies in our database`, true);
      return;
    }

    this._mainFilmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, false, `All movies. Upcoming`);

    this._showedMainMovieControllers = this._renderFilmCards(this._mainFilmsListComponent.cardContainer,
        movies.slice(0, appConst.SHOWING_FILM_CARDS_COUNT_ON_START));
    this._showingFilmCardsCount = this._showedMainMovieControllers.length;

    this._renderShowMoreButton();

    this.renderTopRated();
    this.renderMostCommented();
  }

  /**
   * Обработчик нажатия на кнопку "Show more"
   * @private
   */
  _onShowMoreButtonClick() {
    const movies = this._moviesModel.getMovies();
    const prevTasksCount = this._showingFilmCardsCount;
    this._showingFilmCardsCount = this._showingFilmCardsCount + Math.min(movies.length - prevTasksCount, appConst.SHOWING_FILM_CARDS_COUNT_BY_BUTTON);
    const newFilmCards = this._renderFilmCards(this._mainFilmsListComponent.cardContainer, movies.slice(prevTasksCount, this._showingFilmCardsCount));
    this._showedMainMovieControllers = this._showedMainMovieControllers.concat(newFilmCards);
    this._showingFilmCardsCount = this._showedMainMovieControllers.length;

    if (this._showingFilmCardsCount >= movies.length) {
      // Удаление кнопки
      this._showMoreButtonComponent.remove();
      this._showMoreButtonComponent = null;
    }
  }

  /**
   * Отрисовка кнопки "Show more"
   * @private
   */
  _renderShowMoreButton() {
    const movies = this._moviesModel.getMovies();
    if (movies.length > this._showingFilmCardsCount) {
      if (!this._showMoreButtonComponent) {
        this._showMoreButtonComponent = new ShowMoreButtonComponent(this._mainFilmsListComponent.getElement(), RenderPosition.BEFOREEND);
      }
      this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
    }
  }

  /**
   * Отрисовывает дополнительную секцию с фильмами
   * @param {string} header - Заголовок дополнительной секции
   * @param {function} sortFunction - Функция сортировки фильмов для дополнительной секции
   * @param {function} filterFunction - Функция фильтрации фильмов для дополнительной секции
   * @return {[FilmsListComponent,MovieController[]]} - Компонент списка фильма и Массив отрисованных контроллеров фильмов
   * @private
   */
  _renderExtraMovies(header, sortFunction, filterFunction) {
    const moviesAll = this._moviesModel.getMoviesAll();

    let movies = moviesAll.slice().sort(sortFunction);

    movies = movies.slice(0, appConst.EXTRA_FILM_CARDS_COUNT).filter(filterFunction);

    if (movies.length > 0) {
      const filmsListComponent = new FilmsListComponent(this._container, RenderPosition.BEFOREEND, true, header);
      const showedExtraMovieControllers = this._renderFilmCards(filmsListComponent.cardContainer, movies);
      return [filmsListComponent, showedExtraMovieControllers];
    } else {
      return [null, []];
    }
  }

  /**
   * Рендеринг списка фильмов Top Rated
   */
  renderTopRated() {
    this._resetTopRated();
    [this._topRatedFilmsListComponent, this._showedTopRatedMoviewControllers] =
      this._renderExtraMovies(`Top rated`, (a, b) => b.rating - a.rating,
          (movie) => movie.rating > 0);
  }

  /**
   * Рендеринг списка фильмов Most Commented
   */
  renderMostCommented() {
    this._resetMostCommented();

    [this._mostCommntedFilmsListComponent, this._showedMostCommentedMoviewControllers] =
      this._renderExtraMovies(`Most commented`, (a, b) => b.comments.length - a.comments.length,
          (movie) => movie.comments.length > 0);
  }


  /**
   * Обработчик изменения данных
   * @param {MovieController} movieController - Контроллер фильма
   * @param {{}} oldData - Старые данные
   * @param {{}} newData - Новые данные
   * @private
   */
  _onDataChange(movieController, oldData, newData) {

    const isSuccess = this._moviesModel.updateMovie(oldData.id, newData);

    if (isSuccess) {
      movieController.render(newData);
    }
  }

  /**
   * Обработчик изменения отображения
   * @private
   */
  _onViewChange() {
    this._showedMainMovieControllers.forEach((it) => it.setDefaultView());
  }
}
