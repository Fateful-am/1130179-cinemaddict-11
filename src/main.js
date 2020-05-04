import {generateFilmCards} from './mock/film-card.js';
import {FILM_CARDS_COUNT} from './const.js';
import SiteController from './controllers/site.js';
import Movies from './models/movies.js';

// Генерация карточек (Моки)
const filmCards = generateFilmCards(FILM_CARDS_COUNT);

const moviesModel = new Movies();
moviesModel.setMovies(filmCards);

// Контроллер главной страницы
const siteController = new SiteController(moviesModel);

// Количество загруженных фильмов
siteController.footerStatisticsComponent.movieCont = moviesModel.getMovieCount();

siteController.renderFilms();


