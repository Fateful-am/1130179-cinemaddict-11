import Movie from "./models/movie.js";

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }
  _getHeaders() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return headers;
  }

  getMovies() {
    const headers = this._getHeaders();
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(movieId) {
    const headers = this._getHeaders();
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${movieId}`, {headers})
      .then((response) => response.json())
      .then(Movie.parseComments);
  }

  updateMovie(id, data) {
    const headers = this._getHeaders();

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data),
      headers,
    })
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }
}

