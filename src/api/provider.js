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
          movies.forEach((movie) => this._store.setMovieItem(movie.id, movie.toRAW()));

          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getMovieItems());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          comments.forEach((comment) => this._store.setCommentItem(movieId, comment));

          return comments;
        });
    }

    const storeComments = Object.values(this._store.getMovieComments(movieId));

    return Promise.resolve(storeComments);
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
          this._store.setMovieItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }

    const localMovie = Movie.clone(Object.assign(data, {id}));
    this._store.setMovieItem(id, localMovie.toRAW());

    return Promise.resolve(localMovie);
  }

  deleteComment(movieId, commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(this._store.removeCommentItem(movieId, commentId));
    }

    this._store.removeCommentItem(movieId, commentId);
    return Promise.resolve();
  }
}
