import SiteController from './controllers/site.js';
import Movies from './models/movies.js';
import API from "./api.js";

const AUTHORIZATION = `Basic dXNickBwYXNzd75yZAo=`;

const api = new API(AUTHORIZATION);
const moviesModel = new Movies(api);

// Контроллер главной страницы
const siteController = new SiteController(moviesModel);

api.getTasks()
  .then((movies) => {
    moviesModel.setMovies(movies);
    siteController.renderFilms();
  })
  .catch(() => siteController.renderFilms());

moviesModel.setMovies([]);
siteController.renderFilms();


