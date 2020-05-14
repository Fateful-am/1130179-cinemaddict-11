export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getMovies() {
    return this._api.getMovies();
  }

  getComments(movieId) {
    return this._api.getComments(movieId);
  }

  createComment(filmId, data) {
    return this._api.createComment(filmId, data);
  }

  updateMovie(id, data) {
    return this._api.updateMovie(id, data);
  }

  deleteComment(id) {
    return this._api.deleteComment(id);
  }
}
