import {RenderPosition} from '../utils/render.js';
import FilmsListComponent from '../components/films-list.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import * as appConst from '../const.js';
import MovieController, {Mode, SHAKE_ANIMATION_TIMEOUT} from './movie.js';
import {SortType} from '../const.js';
import Statistics from '../components/statistics';
import {FilterType} from '../const';
import Movie from '../models/movie';

// Режим изменения данных
const DataChangeKind = {
  UPDATE: `update`,
  DELETE: `delete`,
  INSERT: `insert`
};

// Тип изменения данных
const UpdateKind = {
  WATCH_LIST: `watchList`,
  WATCHED: `watched`,
  FAVORITE: `favorite`
};

/** Контроллер списка фильмов */
export default class FilmsBoardController {
  /**
   * @constructor
   * @param {SiteController} siteController - Контроллер индексной страницы
   * @param {AbstractComponent} container - Контайнер для списка
   * @param {Element} popupContainer - Контейнер для попапа
   * @param {SortMenuComponent} sortMenuComponent - Компонент меню сортировки
   * @param {Movies} moviesModel - Модель с фильмами
   * @param {Provider} api - Экземпляр класса Provider
   */
  constructor(siteController, container, popupContainer, sortMenuComponent, moviesModel, api) {
    this._siteController = siteController;
    this._container = container;
    this._popupContainer = popupContainer;
    this._moviesModel = moviesModel;
    this._api = api;
    this._activeSortType = SortType.DEFAULT;
    this._activeMode = Mode.DEFAULT;
    this._sortMenuComponent = sortMenuComponent;
    this._renderCount = 0;

    this._sortMenuComponent.setSortTypeChangeHandler((sortType) => {
      this._renderMainFilmList(this._getSortedFilms(sortType));
    });
    this._statsComponent = new Statistics(this._container.getElement().parentElement, RenderPosition.BEFOREEND, this._moviesModel);
    this._siteController.profileRatingComponent.watchedCount = this._moviesModel.getWatchedCount();


    this._mainFilmsListComponent = null;
    this._topRatedFilmsListComponent = null;
    this._mostCommntedFilmsListComponent = null;
    this._showMoreButtonComponent = null;

    this._showedMainMovieControllers = [];
    this._showedTopRatedMovieControllers = [];
    this._showedMostCommentedMovieControllers = [];
    this._reset();

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  /**
   * Получение отсортированного списка фильмов
   * @param {string} sortType - Тип сортировки
   * @return {[Movie]} - Массив отсортированных фильмов
   * @private
   */
  _getSortedFilms(sortType) {
    this._activeSortType = sortType;

    const showingFilms = this._moviesModel.getMovies().slice();
    switch (sortType) {
      case appConst.SortType.DATE:
        return showingFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      case appConst.SortType.RATING:
        return showingFilms.sort((a, b) => b.rating - a.rating);
      default:
        return showingFilms;
    }
  }


  /**
   * Генеация и рендеринг контроллеров фильмов
   * @param {Element} container - Контайнер для компонента фильма
   * @param {[Movie]} movies - Массив с данными для генерации контроллеров фильмов
   * @return {MovieController[]} - Массив с контроллерами фильмов
   * @private
   */
  _renderFilmCards(container, movies) {
    return movies.map((movie) => {
      const movieController = new MovieController(container, this._popupContainer, movie.id, this._onDataChange,
          this._onViewChange);

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
  }

  /**
   * Сбрасывает секцию "Top Rated"
    * @private
   */
  _resetTopRated() {
    this._resetShowedMovieControllers(this._showedTopRatedMovieControllers);

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
    this._resetShowedMovieControllers(this._showedMostCommentedMovieControllers);

    if (this._mostCommntedFilmsListComponent) {
      this._mostCommntedFilmsListComponent.remove();
      this._mostCommntedFilmsListComponent = null;
    }
  }

  /**
   * Отрисовка компонента основного списка фильмов
   * @param {[Object]} movies - Массив данных фильмов для отрисовки
   * @return {boolean} - Были ли фильмы для отрисовки
   * @private
   */
  _renderMainFilmListComponent(movies) {
    this._reset();

    // Если фильмов нет - показываем заглушку
    if (movies.length === 0) {
      const noFilmText = this._renderCount === 0 ? `Loading...` : `There are no movies in our database`;
      this._mainFilmsListComponent = new FilmsListComponent(this._container.getElement(), RenderPosition.AFTERBEGIN, false, noFilmText, true);
      return false;
    }

    this._mainFilmsListComponent = new FilmsListComponent(this._container.getElement(), RenderPosition.AFTERBEGIN, false, `All movies. Upcoming`);
    return true;
  }

  /**
   * Отрисовка основного списка фильмов
   * @param {[Movie]} movies - Массив данных фильмов для отрисовки
   * @private
   */
  _renderMainFilmList(movies) {
    if (!this._renderMainFilmListComponent(movies)) {
      if (this._moviesModel.activeFilterType === FilterType.STATS) {
        this._sortMenuComponent.hide();
        this._mainFilmsListComponent.hide();
        this._statsComponent.show();
      }

      return;
    }
    this._sortMenuComponent.show();
    this._mainFilmsListComponent.show();
    this._statsComponent.hide();

    this._showedMainMovieControllers = this._renderFilmCards(this._mainFilmsListComponent.cardContainer,
        movies.slice(0, appConst.SHOWING_FILM_CARDS_COUNT_ON_START));
    this._showingFilmCardsCount = this._showedMainMovieControllers.length;

    this._renderShowMoreButton();
  }

  /**
   * Изначальный рендеринг списка фильмов
   */
  render() {
    this._renderMainFilmList(this._getSortedFilms(this._activeSortType));

    this.renderTopRated();
    this.renderMostCommented();
    this._renderCount++;
  }

  /**
   * Обработчик нажатия на кнопку "Show more"
   * @private
   */
  _onShowMoreButtonClick() {
    const movies = this._getSortedFilms(this._activeSortType);
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
    const moviesAll = this._getSortedFilms(this._activeSortType);

    let movies = moviesAll.slice().sort(sortFunction);

    movies = movies.slice(0, appConst.EXTRA_FILM_CARDS_COUNT).filter(filterFunction);

    if (movies.length > 0) {
      const filmsListComponent = new FilmsListComponent(this._container.getElement(), RenderPosition.BEFOREEND, true, header);
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
    [this._topRatedFilmsListComponent, this._showedTopRatedMovieControllers] =
      this._renderExtraMovies(`Top rated`, (a, b) => b.rating - a.rating,
          (movie) => movie.rating > 0);
  }

  /**
   * Рендеринг списка фильмов Most Commented
   */
  renderMostCommented() {
    this._resetMostCommented();

    [this._mostCommntedFilmsListComponent, this._showedMostCommentedMovieControllers] =
      this._renderExtraMovies(`Most commented`, (a, b) => b.comments.length - a.comments.length,
          (movie) => movie.comments.length > 0);
  }


  /**
   * Определение режима изменения данных
   * @param {Movie} oldData - Старые данные
   * @param {Movie} newData - Новые данные
   * @return {{detail: (*), type: string}|{detail: string, type: string}|{detail: {date: string, emotion, comment}, type: string}} - Объект с подробностями изменения данных
   * @private
   */
  _dataChangeType(oldData, newData) {
    if (oldData.comments.length > newData.comments.length) {
      const deleteArray = newData.comments.map((it, i) => it.id !== oldData.comments[i].id ? oldData.comments[i].id : null)
        .filter((it) => it);
      return {
        type: DataChangeKind.DELETE,
        detail: deleteArray.length === 0 ? oldData.comments[oldData.comments.length - 1].id : deleteArray[0]
      };
    } else if (oldData.comments.length < newData.comments.length) {
      const {text: comment, date, emoji: emotion} = newData.comments[newData.comments.length - 1];
      return {
        type: DataChangeKind.INSERT,
        detail: {comment, date: date.toISOString(), emotion}
      };
    }

    const type = DataChangeKind.UPDATE;
    if (oldData.addedToWatchlist !== newData.addedToWatchlist) {
      return {type, detail: UpdateKind.WATCH_LIST};
    }
    if (oldData.markedAsWatched !== newData.markedAsWatched) {
      return {type, detail: UpdateKind.WATCHED};
    }

    return {type, detail: UpdateKind.FAVORITE};
  }


  /**
   * Рендер при удачно завершивсемся сетевом запросе
   * @param {MovieController} movieController - Контроллер карточки фильма
   * @param {String} oldDataId - Id карточки фильма
   * @param {Movie} data - Обновленная карточка фильма
   * @return {boolean} - Удачно ли прошло обновление
   * @private
   */
  _successRender(movieController, oldDataId, data) {
    const isSuccess = this._moviesModel.updateMovie(oldDataId, data);
    if (isSuccess) {
      movieController.render(data);

      // Перерисовываем карточки в других списках
      const showedSameMovieControllers = [].concat(this._showedMainMovieControllers, this._showedMostCommentedMovieControllers,
          this._showedTopRatedMovieControllers).filter((it) => it.movieId === data.id && it !== movieController);
      showedSameMovieControllers.forEach((it) => {
        it.forceRender = true;
        it.render(data);
        it.forceRender = false;
      });
      this._statsComponent.reRender();
      this._siteController.profileRatingComponent.watchedCount = this._moviesModel.getWatchedCount();
      return true;
    }
    throw new Error(`Not success`);
  }

  /**
   * Рендер при неудачно завершивсемся сетевом запросе
   * @param {MovieController} movieController - Контроллер карточки фильма
   * @param {String} commentId - Id комментария
   * @param {Movie} oldData - Старые данные
   * @param {boolean} whenCreating - При создании комментария
   * @private
   */
  _failureRender(movieController, commentId, oldData, whenCreating = false) {
    movieController.shake(commentId, whenCreating);
    setTimeout(() => {
      const commentText = movieController.filmPopupComponent.getElement().querySelector(`.film-details__comment-input`).value;
      movieController.render(oldData);
      if (whenCreating) {
        const commentElement = movieController.filmPopupComponent.getElement().querySelector(`.film-details__comment-input`);
        commentElement.value = commentText;
        commentElement.style = `outline: 3px solid red;`;
      }
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  /**
   * Обработчик изменения данных
   * @param {MovieController} movieController - Контроллер фильма
   * @param {Movie} oldData - Старые данные
   * @param {Movie} newData - Новые данные
   * @private
   */
  _onDataChange(movieController, oldData, newData) {
    const dataChangeType = this._dataChangeType(oldData, newData);
    switch (dataChangeType.type) {
      case DataChangeKind.UPDATE:
        this._api.updateMovie(oldData.id, newData)
          .then((movieModel) => {
            movieModel.restoreComments();
            if (this._successRender(movieController, oldData.id, movieModel)) {
              if (this._activeMode === Mode.DETAIL) {
                this._getComments(movieController);
              }
            }
          })
          .catch(() => {
            switch (dataChangeType.detail) {
              case UpdateKind.WATCH_LIST:
                movieController.toggleFilmCardButtonClass(`add-to-watchlist`);
                break;
              case UpdateKind.WATCHED:
                movieController.toggleFilmCardButtonClass(`mark-as-watched`);
                break;
              default:
                movieController.toggleFilmCardButtonClass(`favorite`);
            }
            this._failureRender(movieController, null, oldData);
          });
        break;
      case DataChangeKind.DELETE:
        this._api.deleteComment(dataChangeType.detail)
          .then(() => this._successRender(movieController, oldData.id, newData))
          .catch(() => this._failureRender(movieController, dataChangeType.detail, oldData));
        break;
      default: // INSERT
        this._api.createComment(newData.id, dataChangeType.detail)
          .then((newComments) => {
            const newMovie = Movie.clone(oldData);

            newMovie.comments = newComments;
            movieController.filmPopupComponent.initPopup(true);
            this._successRender(movieController, oldData.id, newMovie);
          })
          .catch(() => this._failureRender(movieController, null, oldData, true));
    }
  }

  /**
   * Запрос комментариев о фильме с сервера
   * @param {MovieController} movieController - Контроллер фильма
   * @private
   */
  _getComments(movieController) {
    const movie = this._moviesModel.getMovieById(movieController.movieId);
    if (movie && movie.comments.length > 0 && !movie.comments[0].id) {
      movie.comments[0] = Object.assign({}, movie.comments[0], {text: `loading...`});
      this._moviesModel.getComments(movieController.movieId)
        .then((comments) => {
          movie.comments = comments;
          movieController.rerenderPopupComponent(movie);
        })
        .catch(() => {
          movie.comments[0] = Object.assign({}, movie.comments[0], {text: movie.comments.length + ` [Offline...]`});
          movieController.rerenderPopupComponent(movie);
        });
    }
  }

  /**
   * Обработчик изменения отображения
   * @param {string} movieMode - Режим отображения
   * @param {MovieController} movieController - Текущий фильм для попапа
   * @private
   */
  _onViewChange(movieMode, movieController = null) {
    this._activeMode = movieMode;
    switch (movieMode) {
      case Mode.DEFAULT :
        this.renderMostCommented();
        break;
      case Mode.DETAIL:
        this._getComments(movieController);

        this._showedMainMovieControllers.forEach((it) => it.setDefaultView());
    }
  }

  /**
   * Обработчик при смене сортировки карточек фильмов
   * @private
   */
  _onFilterChange() {
    this._sortMenuComponent.setSortType(SortType.DEFAULT);
    this.render();
  }

  /**
   * Скрывает списки фильмов
   */
  hide() {
    this._container.hide();
  }

  /**
   * Показывает списки фильмов
   */
  show() {
    this._container.show();
  }
}
