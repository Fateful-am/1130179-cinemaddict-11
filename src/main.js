import SiteController from './controllers/site.js';
import Movies from './models/movies.js';
import API from "./api.js";

// Строка авторизации
const AUTHORIZATION = `Basic dXNickBwYXNzd75yZAo=`;
// Точка доступа в сети
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new Movies(api);

// Контроллер главной страницы
const siteController = new SiteController(moviesModel, api);

// Получение данных о фильмах с сервера
api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    siteController.renderFilms();
  })
  .catch(() => siteController.renderFilms());

// отрисовка пустых фильмов
moviesModel.setMovies([]);
siteController.renderFilms();


