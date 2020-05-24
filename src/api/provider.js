import Movie from '../models/movie.js';
import {nanoid} from 'nanoid';

/**
 * Проверка доступности интеренета
 * @return {boolean}
 */
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
          const movieItems = movies.reduce((acc, current) => {
            return Object.assign({}, acc, {
              [current.id]: current.toRAW(),
            });
          }, {});

          this._store.setMovieItems(movieItems);

          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getMovieItems());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  _setCommentItems(movieId, comments) {
    const commentItems = comments.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id || current.commentId]: current,
      });
    }, {});

    this._store.setCommentItems(movieId, commentItems);
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          this._setCommentItems(movieId, comments);

          return comments;
        });
    }

    const storeComments = Object.values(this._store.getMovieComments(movieId));

    return Promise.resolve(storeComments);
  }

  createComment(filmId, data) {
    const isOnlineState = isOnline();
    if (isOnlineState) {
      return this._api.createComment(filmId, data)
        .then((comments) => {
          this._setCommentItems(filmId, comments);
          return {
            movieId: filmId,
            comments
          };
        });
    }
    const localCommentId = nanoid();
    const newComment = Object.assign({}, data, {id: localCommentId, author: `I am Groot`});
    this._store.setCommentItem(filmId, Movie.parseComment(newComment), isOnlineState);
    const comments = Object.values(this._store.getMovieComments(filmId));

    return Promise.resolve({movieId: filmId,
      comments});
  }

  updateMovie(id, data) {
    const isOnlineState = isOnline();
    if (isOnlineState) {
      return this._api.updateMovie(id, data)
        .then((newMovie) => {
          this._store.setMovieItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }

    const localMovie = Movie.clone(Object.assign(data, {id}));
    this._store.setMovieItem(id, localMovie.toRAW(), isOnlineState);

    return Promise.resolve(localMovie);
  }

  deleteComment(movieId, commentId) {
    const isOnlineState = isOnline();
    if (isOnlineState) {
      return this._api.deleteComment(commentId)
        .then(this._store.removeCommentItem(movieId, commentId));
    }

    this._store.removeCommentItem(movieId, commentId, isOnlineState);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const updatedMovies = this._store.getOfflineUpdatedMovies();
      if (updatedMovies.length === 0) {
        return Promise.resolve();
      }

      return this._api.sync(updatedMovies)
        .then((response) => {
          response.forEach((movie) => this._store.setMovieItem(movie.id, movie.toRAW()));

          return response;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  syncCreatedComments() {
    if (isOnline()) {
      const createdComments = this._store.getOfflineCreatedComments();
      if (createdComments.length === 0) {
        return Promise.resolve();
      }

      return Promise.all(
          createdComments.map((commentData) => {
            return this.createComment(commentData.movieId, commentData.commentObject);
          }))
        .then((response) => {
          createdComments.forEach((it) => {
            this._store.deleteCreatedOfflineComment(it.movieId, it.commentId);
          });
          return response;
        });
    }

    return Promise.reject(new Error(`Sync createdCommentsData failed`));
  }

  syncDeletedComments() {
    if (isOnline()) {
      const deletedComments = this._store.getOfflineDeletedComments();
      if (deletedComments.length === 0) {
        return Promise.resolve();
      }

      return Promise.all(
          deletedComments.map((comment) => {
            return this.deleteComment(comment.movieId, comment.commentId);
          }))
        .then((response) => {
          deletedComments.forEach((it) => {
            this._store.deleteDeletedOfflineComment(it.commentId);
          });
          return response.map((commentId) => deletedComments
            .filter((it) => it.commentId === commentId)[0].movieId);
        });
    }

    return Promise.reject(new Error(`Sync deletedCommentsData failed`));
  }
}
