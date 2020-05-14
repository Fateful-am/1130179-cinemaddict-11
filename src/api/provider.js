import Movie from '../models/movie.js';

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.forEach((movie) => this._store.setItem(movie.id, movie.toRAW()));

          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  createComment(filmId, data) {
    if (isOnline()) {
      return this._api.createComment(filmId, data);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  updateMovie(id, data) {
    if (isOnline()) {
      return this._api.updateMovie(id, data)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }

    const localMovie = Movie.clone(Object.assign(data, {id}));
    this._store.setItem(id, localMovie.toRAW());

    return Promise.resolve(localMovie);
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }
}
