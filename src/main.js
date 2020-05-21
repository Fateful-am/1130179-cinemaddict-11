import SiteController from './controllers/site.js';
import Movies from './models/movies.js';
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import API from "./api/index.js";

// Строка авторизации
const AUTHORIZATION = `Basic dXNickBwYXNzd75yZAo=`;
// Точка доступа в сети
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
    // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

// отрисовка пустых фильмов
moviesModel.setMovies([]);
siteController.renderFilms();

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
