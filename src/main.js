import {generateFilmCards} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import * as appConst from './const.js';
import SiteController from './controllers/site.js';

// Генерация карточек (Моки)
const filmCards = generateFilmCards(appConst.FILM_CARDS_COUNT);
// const extraFilmCards = generateFilmCards(appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT);

const siteController = new SiteController();

// Заполнение данными разметки из моки
siteController.profileRatingComponent.watchedCount = appConst.USER_WATCHED_COUNT;
siteController.filterMenuComponent.filters = generateFilters();
siteController.footerStatisticsComponent.movieCont = appConst.MOVIE_COUNT;
siteController.renderFilms(filmCards);

