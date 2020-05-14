import SiteController from './controllers/site.js';
import Movies from './models/movies.js';
import Provider from "./api/provider.js";
import API from "./api";

// Строка авторизации
const AUTHORIZATION = `Basic dXNickBwYXNzd75yZAo=`;
// Точка доступа в сети
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;

const api = new API(END_POINT, AUTHORIZATION);
const apiWithProvider = new Provider(api);

const moviesModel = new Movies(apiWithProvider);

// Контроллер главной страницы
const siteController = new SiteController(moviesModel, apiWithProvider);

// Получение данных о фильмах с сервера
apiWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    siteController.renderFilms();
  })
  .catch(() => siteController.renderFilms());

// отрисовка пустых фильмов
moviesModel.setMovies([]);
siteController.renderFilms();


