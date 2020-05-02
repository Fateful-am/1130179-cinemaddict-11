import {FilterType} from '../const';

export default class Movies {
  constructor() {
    this._movies = [];

    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMoviesByFilter(filterType) {
    const allMovies = this.getMoviesAll();

    switch (filterType) {
      case FilterType.ALL:
        return allMovies;
      case FilterType.FAVORITES:
        return allMovies.filter((movie) => movie.addedToFavorite);
      case FilterType.HISTORY:
        return allMovies.filter((movie) => movie.markedAsWatched);
      case FilterType.WATCH_LIST:
        return allMovies.filter((movie) => movie.addedToWatchlist);
      default:
        return [];
    }
  }

  getMoviesAll() {
    return this._movies;
  }

  getMovies() {
    return this.getMoviesByFilter(this._activeFilterType);
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateMovie(id, newMovieData) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), newMovieData, this._movies.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}
