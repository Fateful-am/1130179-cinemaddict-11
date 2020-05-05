// import {generateFilmCards} from './mock/film-card.js';
// import {FILM_CARDS_COUNT} from './const.js';
import SiteController from './controllers/site.js';
import Movies from './models/movies.js';
import API from "./api.js";

// Генерация карточек (Моки)
// const filmCards = generateFilmCards(FILM_CARDS_COUNT);

const AUTHORIZATION = `Basic dXNickBwYXNzd75yZAo=`;

const moviesModel = new Movies();
const api = new API(AUTHORIZATION);

// Контроллер главной страницы
const siteController = new SiteController(moviesModel);

api.getTasks()
  .then((movies) => {
    moviesModel.setMovies(movies);
    siteController.renderFilms();
    // Количество загруженных фильмов
    siteController.footerStatisticsComponent.movieCont = moviesModel.getMovieCount();
  });


