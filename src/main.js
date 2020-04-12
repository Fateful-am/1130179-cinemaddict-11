import {createExtraFilmsTemplate} from './components/extra-films.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createFilmsTemplate} from './components/films.js';
import {createFooterStatisticsTemplate} from './components/footer-statistics.js';
import {createMainMenuTemplate} from './components/main-menu.js';
import {createProfileRatingTemplate} from './components/profile-rating';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createSortMenuTemplate} from './components/sort-menu.js';
import {createFilmPopupCardTemplate} from './components/film-popup.js';
import {generateFilmCards} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import * as appConst from './const.js';


/**
 * Рендеренг компонентов
 * @param {Element} container Контейнер для шаблона
 * @param {String} template HTML-компонент для вставки
 * @param {InsertPosition} place Место вставки
 */
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

/**
 * Рендеринг карточек фильмов
 * @param {Array} films Массив с карточками фильмов
 * @param {Element} container Когтейнер для генерации разметки карточек фильмов
 * @param {InsertPosition} place Место вставки
 * @param {number} fromIndex Стартовый индекс массива
 * @param {number} toIndex Конечный индекс массива
 */
const createFilmCards = (films, container, place, fromIndex, toIndex) => {
  films.slice(fromIndex, toIndex)
    .forEach((filmCard) => render(container, createFilmCardTemplate(filmCard), place));
};

const siteHeaderElement = document.querySelector(`.header`);

// Отрисовка компонента - Звание пользователя
render(siteHeaderElement, createProfileRatingTemplate(appConst.USER_WATCHED_COUNT), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

// Отрисовка компонента - Меню
render(siteMainElement, createMainMenuTemplate(generateFilters()), `beforeend`);
// Отрисовка компонента - Меню сортировки
render(siteMainElement, createSortMenuTemplate(), `beforeend`);
// Отрисовка компонента - Контент-контейнер
render(siteMainElement, createFilmsTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmListContainerElement = filmsListElement.querySelector(`.films-list__container`);

const filmCards = generateFilmCards(appConst.FILM_CARDS_COUNT);

// Переменная счетчик показанных карточек фильмов
let showingFilmCardsCount = appConst.SHOWING_FILM_CARDS_COUNT_ON_START;

// Отрисовка карточек фильмов
createFilmCards(filmCards, filmListContainerElement, `beforeend`, 0, showingFilmCardsCount);

// Отрисовка компонента - Кнопка «Show more»
render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

const loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

// Событие клика по кнопке
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingFilmCardsCount;
  showingFilmCardsCount = showingFilmCardsCount + appConst.SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

  createFilmCards(filmCards, filmListContainerElement, `beforeend`, prevTasksCount, showingFilmCardsCount);

  if (showingFilmCardsCount >= filmCards.length) {
    loadMoreButton.remove();
  }
});

// Отрисовка компонента - Экстра контент-контейнер
render(filmsElement, createExtraFilmsTemplate(`Top rated`), `beforeend`);
render(filmsElement, createExtraFilmsTemplate(`Most commented`), `beforeend`);

const topRatedContainerElement = filmsElement.querySelector(`.films-list--extra:nth-last-child(2) .films-list__container`);
const mostCommentedContainerElement = filmsElement.querySelector(`.films-list--extra:nth-last-child(1) .films-list__container`);

const extraFilmCards = generateFilmCards(appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT);

// Отрисовка карточек фильмов Top rated
createFilmCards(extraFilmCards, topRatedContainerElement, `beforeend`, 0, appConst.EXTRA_FILM_CARDS_COUNT);

// Отрисовка карточек фильмов Most commented
createFilmCards(extraFilmCards, mostCommentedContainerElement, `beforeend`,
    appConst.EXTRA_FILM_CARDS_COUNT, appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFooterStatisticsTemplate(appConst.MOVIE_COUNT), `beforeend`);

const bodyElement = document.querySelector(`body`);
// отрисовка подробностей о фильме
render(bodyElement, createFilmPopupCardTemplate(filmCards[0]), `beforeend`);
