import {generateFilmCards} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import * as appConst from './const.js';
import SiteController from './controllers/site.js';
import Movies from './models/movies.js';

// Генерация карточек (Моки)
const filmCards = generateFilmCards(appConst.FILM_CARDS_COUNT);

const moviesModel = new Movies();
moviesModel.setMovies(filmCards);

// Контроллер главной страницы
const siteController = new SiteController(moviesModel);

// Заполнение данными разметки из моки
siteController.profileRatingComponent.watchedCount = appConst.USER_WATCHED_COUNT;
siteController.filterMenuComponent.filters = generateFilters();
siteController.footerStatisticsComponent.movieCont = appConst.MOVIE_COUNT;


siteController.renderFilms();


