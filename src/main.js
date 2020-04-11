import {createExtraFilmsTemplate} from './components/extra-films.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createFilmsTemplate} from './components/films.js';
import {createFooterStatisticsTemplate} from './components/footer-statistics.js';
import {createMainMenuTemplate} from './components/main-menu.js';
import {createProfileRatingTemplate} from './components/profile-rating';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createSortMenuTemplate} from './components/sort-menu.js';
import {generateFilmCards} from './mock/film-card.js';


const FILM_CARDS_COUNT = 5;
const EXTRA_FILM_CARDS_COUNT = 2;
const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const EXTRA_FILM_SECTION_COUNT = 2;

/**
 * Функция рендеренга компонентов
 * @param {Element} container Контейнер для шаблона
 * @param {String} template HTML-компонент для вставки
 * @param {InsertPosition} place Место вставки
 */
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const siteHeaderElement = document.querySelector(`.header`);

// Отрисовка компонента - Звание пользователя
render(siteHeaderElement, createProfileRatingTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

// Отрисовка компонента - Меню
render(siteMainElement, createMainMenuTemplate(), `beforeend`);
// Отрисовка компонента - Меню сортировки
render(siteMainElement, createSortMenuTemplate(), `beforeend`);
// Отрисовка компонента - Контент-контейнер
render(siteMainElement, createFilmsTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmListContainerElement = filmsListElement.querySelector(`.films-list__container`);

const filmCards = generateFilmCards(FILM_CARDS_COUNT);
// Отрисовка карточек фильмов
filmCards.slice(0, SHOWING_FILM_CARDS_COUNT_ON_START)
  .forEach((filmCard) => render(filmListContainerElement, createFilmCardTemplate(filmCard), `beforeend`));

// Отрисовка компонента - Кнопка «Show more»
render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

// Отрисовка компонента - Экстра контент-контейнер
render(filmsElement, createExtraFilmsTemplate(`Top rated`), `beforeend`);
render(filmsElement, createExtraFilmsTemplate(`Most commented`), `beforeend`);

const topRatedContainerElement = filmsElement.querySelector(`.films-list--extra:nth-last-child(2) .films-list__container`);
const mostCommentedContainerElement = filmsElement.querySelector(`.films-list--extra:nth-last-child(1) .films-list__container`);

const extraFilmCards = generateFilmCards(EXTRA_FILM_CARDS_COUNT * EXTRA_FILM_SECTION_COUNT);

// Отрисовка карточек фильмов Top rated
extraFilmCards.slice(0, EXTRA_FILM_CARDS_COUNT)
  .forEach((filmCard) => render(topRatedContainerElement, createFilmCardTemplate(filmCard), `beforeend`));

// Отрисовка карточек фильмов Most commented
extraFilmCards.slice(EXTRA_FILM_CARDS_COUNT, EXTRA_FILM_CARDS_COUNT * EXTRA_FILM_SECTION_COUNT)
  .forEach((filmCard) => render(mostCommentedContainerElement, createFilmCardTemplate(filmCard), `beforeend`));

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);
