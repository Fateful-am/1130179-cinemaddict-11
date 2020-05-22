import {FilterType, StatisticsPeriod} from '../const';
import moment from 'moment';

/** Модель фильмов */
export default class Movies {
  /**
   * @constructor
   * @param {Provider} api - Апи для работы с сетью
   */
  constructor(api) {
    this._api = api;

    this._movies = [];

    this.activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  /**
   * Получение комментариев для фильма
   * @param {String} movieId - Id фильма
   * @return {Promise<Object[]>} - Промис для загрузки комментариев с сервера
   */
  getComments(movieId) {
    return this._api.getComments(movieId);
  }

  /**
   * Получение отфильтрованного массива с фильмами
   * @param {FilterType} filterType - Тип фильтра
   * @return {Movie[]} - Отфильтрованный массив с фильмами
   */
  getMoviesByFilter(filterType) {
    const allMovies = this.getMoviesAll();
    switch (filterType) {
      case FilterType.FAVORITES:
        return allMovies.filter((movie) => movie.addedToFavorite);
      case FilterType.HISTORY:
        return allMovies.filter((movie) => movie.markedAsWatched);
      case FilterType.WATCH_LIST:
        return allMovies.filter((movie) => movie.addedToWatchlist);
      case FilterType.STATS:
        return [];
      default:
        return allMovies.slice();
    }
  }

  /**
   * Получение всех фильмов
   * @return {[Movie]} - Массив со всеми фильмами
   */
  getMoviesAll() {
    return this._movies;
  }

  /**
   * Получение отфильтрованного массива с фильмами по текущему фильтру
   * @return {[Movie]} - Отфильтрованный массив с фильмами
   */
  getMovies() {
    return this.getMoviesByFilter(this.activeFilterType);
  }

  /**
   * Установка текущего списка фильмов
   * @param {[Movie]} movies - Массив с фильмами
   */
  setMovies(movies) {
    this._movies = Array.from(movies);
    this._callHandlers(this._dataChangeHandlers);
  }

  /**
   * Обновление данных о фильме
   * @param {String} id - Id фильма
   * @param {Movie} newMovieData - Новый объект с данными о фильме
   * @return {boolean} - Флаг успешности обновления данных
   */
  updateMovie(id, newMovieData) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), newMovieData, this._movies.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  /**
   * Добавление обработчика изменения данных
   * @param {function} handler - Колбэк функция обновления данных
   */
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  /**
   * Вызов обработчиков обновления данных
   * @param {[function]} handlers - Массив с колбэк функциями
   * @private
   */
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  /**
   * Установка типа фильтрации фильмов
   * @param {FilterType} filterType - Тип фильтра
   */
  setFilter(filterType) {
    this.activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  /**
   * Добавление обработчика фильтрации данных
   * @param {function} handler - Колбэк функция фильтрации данных
   */
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  /**
   * Вычисление просмотренных пользователем фильмов
   * @return {number} - Число просмотренных пользователем фильмов
   */
  getWatchedCount() {
    const watchedMovies = this._movies.filter((it) => it.markedAsWatched);
    return watchedMovies.length;
  }

  /**
   * Вычисление общего количества загруженных фильмов
   * @return {number} - Число общего количества загруженных фильмов
   */
  getMovieCount() {
    return this._movies.length;
  }

  /**
   * Поиск объекта фильма по Id
   * @param {String} id - Id фильма
   * @return {null|Movie} - Объект с данными о фильме
   */
  getMovieById(id) {
    const index = this._movies.findIndex((it) => it.id === id);
    if (index > -1) {
      return this._movies[index];
    }
    return null;
  }

  /**
   * Вычисление статистики просмотра фильмов пользователем в разрезе жанров
   * @param {StatisticsPeriod} statisticsPeriod - Период статистики
   * @return {{duration: *, watchedCount: number,
   * genresStatistics: ([{duration: number, name: string, count: number}]|this)}} - Статистика просмотра фильмов пользователем в разрезе жанров
   */
  getStatistics(statisticsPeriod) {
    let fromDate = 0;
    switch (statisticsPeriod) {
      case StatisticsPeriod.ALL_TIME:
        fromDate = 0;
        break;
      case StatisticsPeriod.TODAY:
        fromDate = moment().startOf(`date`);
        break;
      case StatisticsPeriod.WEEK:
        fromDate = moment().subtract(1, `weeks`);
        break;
      case StatisticsPeriod.MONTH:
        fromDate = moment().subtract(1, `months`);
        break;
      case StatisticsPeriod.YEAR:
        fromDate = moment().subtract(1, `years`);
    }

    // Фильтрация по переиоду
    const watchedMovies = this._movies.filter((it) => it.markedAsWatched && it.watchingDate > fromDate);

    // Группировка по жанрам
    const genreGroups = watchedMovies.reduce((prev, curr) => {
      curr.genres.forEach((it) => {
        prev[it] = prev[it] || [];
        prev[it].push(curr.duration);
      });
      return prev;
    }, {});

    // Сортировка по жанрам
    const sortedGenres = Object.keys(genreGroups)
      .map((it) => {
        return {
          name: it,
          count: genreGroups[it].length,
          duration: genreGroups[it].reduce((prev, curr) => prev + curr, 0)
        };
      })
      .sort((a, b) => {
        const diff = b.count - a.count;
        if (diff !== 0) {
          return diff;
        }
        return b.duration - a.duration;
      });

    return {
      watchedCount: watchedMovies.length,
      duration: watchedMovies.reduce((a, b) => a + b.duration, 0),
      genresStatistics: sortedGenres.length === 0 ? [{name: ``, count: 0, duration: 0}] : sortedGenres
    };
  }

}
