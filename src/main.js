import FilmsListComponent from './components/films-list.js';
import FilmCardComponent from './components/film-card.js';
import FilmsComponent from './components/films.js';
import FooterStatisticComponent from './components/footer-statistics.js';
import MainMenuComponent from './components/main-menu.js';
import ProfileRatingComponent from './components/profile-rating';
import ShowMoreButtonComponent from './components/show-more-button.js';
import SortMenuComponent from './components/sort-menu.js';
import FilmPopupComponent from './components/film-popup.js';
import NoFilms from './components/no-films.js';

import {generateFilmCards} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import * as appConst from './const.js';
import {render, RenderPosition} from "./utils/render.js";

/**
 * Отрисовка карточки фильма
 * @param {Element} container Контейнер для генерации разметки карточки фильма
 * @param {Object} filmCard Карточка фильма
 * @param {InsertPosition} place Куда вставлять
 */
const renderFilmCard = (container, filmCard, place) => {
  // Обработчик закрытия попапа
  const closePopup = () => {
    bodyElement.removeChild(filmPopupCardComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  // Обработчик показа попапа
  const showPopup = () => {
    bodyElement.appendChild(filmPopupCardComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  // метод назначения клика по объекту для вызова попапа
  const addClickListener = (...rest) => {
    rest.forEach((it) => it.addEventListener(`click`, showPopup));
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closePopup();
    }
  };

  // body- элемент
  const bodyElement = document.querySelector(`body`);
  // Компонент - карточка фильма
  const filmCardComponent = new FilmCardComponent(filmCard);
  // Отрисовка карточки фильма
  render(container, filmCardComponent, place);
  // Элементы по клику которым вызывается попап форма
  const filmCardPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const filmCardTitle = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const filmCardComments = filmCardComponent.getElement().querySelector(`.film-card__comments`);

  // Назначение клика
  addClickListener(filmCardPoster, filmCardTitle, filmCardComments);

  // компонент - попап
  const filmPopupCardComponent = new FilmPopupComponent(filmCard);

  // Кнопка закрытия попапа и назначение обработчика клика по ней
  const popupCloseButton = filmPopupCardComponent.getElement().querySelector(`.film-details__close-btn`);
  popupCloseButton.addEventListener(`click`, closePopup);
};

/**
 * Рендеринг карточек фильмов
 * @param {Element} container Контейнер для генерации разметки карточек фильмов
 * @param {Array} films Массив с карточками фильмов
 * @param {number} fromIndex Стартовый индекс массива
 * @param {number} toIndex Конечный индекс массива
 * @param {InsertPosition} place Место вставки
 */
const renderFilmCards = (container, films, fromIndex, toIndex, place) => {
  films.slice(fromIndex, toIndex)
    .forEach((filmCard) => renderFilmCard(container, filmCard, place));
};

/**
 *
 * @param {Element} container Контейнер для генерации разметки списка фильмов
 * @param {Boolean} isExtra Признак, является ли эта отрисовка отрисовкой доп. секций
 * @param {String} header Заголовок для секций фильмов
 * @return {FilmsListComponent} Компонент-контейнер для карточек фильмов
 */
const renderFilmsList = (container, isExtra, header) => {
  // отрисовка списка карточек
  const filmsListComponent = new FilmsListComponent(isExtra, header);
  render(container, filmsListComponent, RenderPosition.BEFOREEND);

  if (!isExtra) {
    // Отрисовка компонента - Кнопка «Show more»
    const showMoreButtonComponent = new ShowMoreButtonComponent();
    render(filmsListComponent.getElement(), showMoreButtonComponent, RenderPosition.BEFOREEND);

    // Событие клика по кнопке
    showMoreButtonComponent.getElement().addEventListener(`click`, () => {
      const prevTasksCount = showingFilmCardsCount;
      showingFilmCardsCount = showingFilmCardsCount + appConst.SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

      renderFilmCards(filmsListComponent.cardContainer, filmCards, prevTasksCount, showingFilmCardsCount, RenderPosition.BEFOREEND);

      if (showingFilmCardsCount >= filmCards.length) {
        showMoreButtonComponent.getElement().remove();
      }
    });
  }

  return filmsListComponent;
};

/**
 * Отрисовка контейнера со списками фильмов
 */
const renderFilms = () =>{
  // Отрисовка компонента - Контент-контейнер
  const filmsElement = new FilmsComponent();
  render(siteMainElement, filmsElement, RenderPosition.BEFOREEND);

  if (filmCards.length === 0) {
    render(filmsElement.getElement(), new NoFilms(), RenderPosition.BEFOREEND);
    return;
  }
  // Отрисовка основных карточек фильмов
  const mainFilmsListComponent = renderFilmsList(filmsElement.getElement(), false, `All movies. Upcoming`);
  renderFilmCards(mainFilmsListComponent.cardContainer, filmCards, 0, showingFilmCardsCount, RenderPosition.BEFOREEND);

  // Отрисовка extra-top-rated карточек фильмов
  const topRatedFilmsListComponent = renderFilmsList(filmsElement.getElement(), true, `Top rated`);
  renderFilmCards(topRatedFilmsListComponent.cardContainer, extraFilmCards, 0, appConst.EXTRA_FILM_CARDS_COUNT, RenderPosition.BEFOREEND);

  // Отрисовка extra-most-commented карточек фильмов
  const mostCommentedFilmsListComponent = renderFilmsList(filmsElement.getElement(), true, `Most commented`);
  renderFilmCards(mostCommentedFilmsListComponent.cardContainer, extraFilmCards, appConst.EXTRA_FILM_CARDS_COUNT,
      appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT, RenderPosition.BEFOREEND);
};

// Генерация карточек (Моки)
const filmCards = generateFilmCards(appConst.FILM_CARDS_COUNT);
const extraFilmCards = generateFilmCards(appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT);

// Переменная счетчик показанных карточек фильмов
let showingFilmCardsCount = appConst.SHOWING_FILM_CARDS_COUNT_ON_START;

// header - элемент
const siteHeaderElement = document.querySelector(`.header`);

// Отрисовка компонента - Звание пользователя
render(siteHeaderElement, new ProfileRatingComponent(appConst.USER_WATCHED_COUNT), RenderPosition.BEFOREEND);

// main - элемент
const siteMainElement = document.querySelector(`.main`);

// Отрисовка компонента - Меню
render(siteMainElement, new MainMenuComponent(generateFilters()), RenderPosition.BEFOREEND);
// Отрисовка компонента - Меню сортировки
render(siteMainElement, new SortMenuComponent(), RenderPosition.BEFOREEND);

// Отрисовка списков фильмов
renderFilms();

// Отрисовка статистики в подвале
const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatisticComponent(appConst.MOVIE_COUNT), RenderPosition.BEFOREEND);
