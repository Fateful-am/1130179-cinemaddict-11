import ExtraFilmsBoardComponent from './components/extra-films.js';
import FilmCardComponent from './components/film-card.js';
import FilmsBoardComponent from './components/films.js';
import FooterStatisticComponent from './components/footer-statistics.js';
import MainMenuComponent from './components/main-menu.js';
import ProfileRatingComponent from './components/profile-rating';
import ShowMoreButtonComponent from './components/show-more-button.js';
import SortMenuComponent from './components/sort-menu.js';
import FilmPopupComponent from './components/film-popup.js';
import {generateFilmCards} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import * as appConst from './const.js';
import {render} from "./utils.js";


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
    .forEach((filmCard) => render(container, new FilmCardComponent(filmCard).getElement(), place));
};

const siteHeaderElement = document.querySelector(`.header`);

// Отрисовка компонента - Звание пользователя
render(siteHeaderElement, new ProfileRatingComponent(appConst.USER_WATCHED_COUNT).getElement(), appConst.RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

// Отрисовка компонента - Меню
render(siteMainElement, new MainMenuComponent(generateFilters()).getElement(), appConst.RenderPosition.BEFOREEND);
// Отрисовка компонента - Меню сортировки
render(siteMainElement, new SortMenuComponent().getElement(), appConst.RenderPosition.BEFOREEND);
// Отрисовка компонента - Контент-контейнер
render(siteMainElement, new FilmsBoardComponent().getElement(), appConst.RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmListContainerElement = filmsListElement.querySelector(`.films-list__container`);

const filmCards = generateFilmCards(appConst.FILM_CARDS_COUNT);

// Переменная счетчик показанных карточек фильмов
let showingFilmCardsCount = appConst.SHOWING_FILM_CARDS_COUNT_ON_START;

// Отрисовка карточек фильмов
createFilmCards(filmCards, filmListContainerElement, appConst.RenderPosition.BEFOREEND, 0, showingFilmCardsCount);

// Отрисовка компонента - Кнопка «Show more»
render(filmsListElement, new ShowMoreButtonComponent().getElement(), appConst.RenderPosition.BEFOREEND);

const loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

// Событие клика по кнопке
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingFilmCardsCount;
  showingFilmCardsCount = showingFilmCardsCount + appConst.SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

  createFilmCards(filmCards, filmListContainerElement, appConst.RenderPosition.BEFOREEND, prevTasksCount, showingFilmCardsCount);

  if (showingFilmCardsCount >= filmCards.length) {
    loadMoreButton.remove();
  }
});

// Отрисовка компонента - Экстра контент-контейнер
render(filmsElement, new ExtraFilmsBoardComponent(`Top rated`).getElement(), appConst.RenderPosition.BEFOREEND);
render(filmsElement, new ExtraFilmsBoardComponent(`Most commented`).getElement(), appConst.RenderPosition.BEFOREEND);

const topRatedContainerElement = filmsElement.querySelector(`.films-list--extra:nth-last-child(2) .films-list__container`);
const mostCommentedContainerElement = filmsElement.querySelector(`.films-list--extra:nth-last-child(1) .films-list__container`);

const extraFilmCards = generateFilmCards(appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT);

// Отрисовка карточек фильмов Top rated
createFilmCards(extraFilmCards, topRatedContainerElement, appConst.RenderPosition.BEFOREEND, 0, appConst.EXTRA_FILM_CARDS_COUNT);

// Отрисовка карточек фильмов Most commented
createFilmCards(extraFilmCards, mostCommentedContainerElement, appConst.RenderPosition.BEFOREEND,
    appConst.EXTRA_FILM_CARDS_COUNT, appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatisticComponent(appConst.MOVIE_COUNT).getElement(), appConst.RenderPosition.BEFOREEND);

const bodyElement = document.querySelector(`body`);
// отрисовка подробностей о фильме
render(bodyElement, new FilmPopupComponent(filmCards[0]).getElement(), appConst.RenderPosition.BEFOREEND);
