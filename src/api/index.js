import Movie from "../models/movie.js";

// Методы для запросов по сети
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

/**
 * Проверка ответа сервера
 * @param {Response} response - Ответ сервера
 * @return {Response|Error} -Обработанный статус ответа сервера
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

/** Класс для работы с сетью */
export default class API {
  /**
   * @constructor
   * @param {String} endPoint - Адрес сервера
   * @param {String} authorization - Строка авторизации
   */
  constructor(endPoint, authorization) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  /**
   * Запрос данных о всех фильмах
   * @return {Promise<any>} - Промис обработки данных о всех фильмах
   */
  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  /**
   * Запрос данных о комментариях к фильму
   * @param {String} movieId - Id фильма
   * @return {Promise<any>} - Промис обработки данных о комментариях к фильму
   */
  getComments(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then((response) => response.json())
      .then(Movie.parseComments);
  }

  /**
   * Обновление информации о фильме
   * @param {String} id - Id фильма
   * @param {Movie} data - Модель с фильмом
   * @return {Promise<any>} - Промис обработки данных о фильме
   */
  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  /**
   * Создание комментария к фильму
   * @param {String} filmId - Id фильма
   * @param {Object} data - Объект с данными о комментарии
   * @return {Promise<Object[]>} - Промис обработки комментариев
   */
  createComment(filmId, data) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then((response) => {
        return Movie.parseComments(response.comments);
      });
  }

  /**
   * Удаляет комментарий на сервере
   * @param {String} id - Id комментария
   * @return {Promise<Response | Error | void>} - Промис обработки удаления комментария
   */
  deleteComment(id) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  /**
   * Метод для работы с сетью
   * @param {String} url - URL запроса
   * @param {Method} method - Метод запрса
   * @param {String} body - Тело запроса
   * @param {Headers} headers - Заголовки запроса
   * @return {Promise<Response>} - Промис работы с методом
   * @private
   */
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

