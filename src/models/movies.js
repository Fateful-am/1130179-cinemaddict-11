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
      case FilterType.FAVORITES:
        return allMovies.filter((movie) => movie.addedToFavorite);
      case FilterType.HISTORY:
        return allMovies.filter((movie) => movie.markedAsWatched);
      case FilterType.WATCH_LIST:
        return allMovies.filter((movie) => movie.addedToWatchlist);
      default:
        return allMovies.slice();
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

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  getStatistics() {
    const watchedMovies = this._movies.filter((it) => it.markedAsWatched);

    const genreGroups = watchedMovies.reduce((prev, curr) => {
      curr.genres.forEach((it) => {
        prev[it] = prev[it] || [];
        prev[it].push(curr.duration);
      });
      return prev;
    }, {});

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
      genresStatistics: sortedGenres
    };
  }

}
