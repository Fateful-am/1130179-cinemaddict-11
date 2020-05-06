import Movie from "./models/movie.js";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }
  _getHeaders() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);
    return headers;
  }

  getMovies() {
    const headers = this._getHeaders();
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(movieId) {
    const headers = this._getHeaders();
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${movieId}`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Movie.parseComments);
  }

  updateMovie(id, data) {
    const headers = this._getHeaders();
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data.toRAW()),
      headers,
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }
}

