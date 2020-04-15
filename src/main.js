import FilmsListComponent from './components/films-list.js';
import FilmCardComponent from './components/film-card.js';
import FilmsComponent from './components/films.js';
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
 * @param {Element} container Когтейнер для генерации разметки карточек фильмов
 * @param {Array} films Массив с карточками фильмов
 * @param {number} fromIndex Стартовый индекс массива
 * @param {number} toIndex Конечный индекс массива
 * @param {InsertPosition} place Место вставки
 */
const renderFilmCards = (container, films, fromIndex, toIndex, place) => {
  films.slice(fromIndex, toIndex)
    .forEach((filmCard) => render(container, new FilmCardComponent(filmCard).getElement(), place));
};

const renderFilmsList = (container, isExtra, header) => {
  const filmsListComponent = new FilmsListComponent(isExtra, header);
  render(container, filmsListComponent.getElement(), appConst.RenderPosition.BEFOREEND);

  if (!isExtra) {
    // Отрисовка компонента - Кнопка «Show more»
    const showMoreButtonComponent = new ShowMoreButtonComponent();
    render(filmsListComponent.getElement(), showMoreButtonComponent.getElement(), appConst.RenderPosition.BEFOREEND);

    // Событие клика по кнопке
    showMoreButtonComponent.getElement().addEventListener(`click`, () => {
      const prevTasksCount = showingFilmCardsCount;
      showingFilmCardsCount = showingFilmCardsCount + appConst.SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

      renderFilmCards(filmsListComponent.cardContainer, filmCards, prevTasksCount, showingFilmCardsCount, appConst.RenderPosition.BEFOREEND);

      if (showingFilmCardsCount >= filmCards.length) {
        showMoreButtonComponent.getElement().remove();
      }
    });
  }

  return filmsListComponent;
};

const renderFilms = () =>{
// Отрисовка компонента - Контент-контейнер
  const filmsElement = new FilmsComponent().getElement();

  render(siteMainElement, filmsElement, appConst.RenderPosition.BEFOREEND);

  const mainFilmsListComponent = renderFilmsList(filmsElement, false, `All movies. Upcoming`);
  renderFilmCards(mainFilmsListComponent.cardContainer, filmCards, 0, showingFilmCardsCount, appConst.RenderPosition.BEFOREEND);

  const topRatedFilmsListComponent = renderFilmsList(filmsElement, true, `Top rated`);
  renderFilmCards(topRatedFilmsListComponent.cardContainer, extraFilmCards, 0, appConst.EXTRA_FILM_CARDS_COUNT, appConst.RenderPosition.BEFOREEND);

  const mostCommentedFilmsListComponent = renderFilmsList(filmsElement, true, `Most commented`);
  renderFilmCards(mostCommentedFilmsListComponent.cardContainer, extraFilmCards, appConst.EXTRA_FILM_CARDS_COUNT,
      appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT, appConst.RenderPosition.BEFOREEND);
};

// Генерация карточек (Моки)
const filmCards = generateFilmCards(appConst.FILM_CARDS_COUNT);
const extraFilmCards = generateFilmCards(appConst.EXTRA_FILM_CARDS_COUNT * appConst.EXTRA_FILM_SECTION_COUNT);

// Переменная счетчик показанных карточек фильмов
let showingFilmCardsCount = appConst.SHOWING_FILM_CARDS_COUNT_ON_START;

const siteHeaderElement = document.querySelector(`.header`);

// Отрисовка компонента - Звание пользователя
render(siteHeaderElement, new ProfileRatingComponent(appConst.USER_WATCHED_COUNT).getElement(), appConst.RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

// Отрисовка компонента - Меню
render(siteMainElement, new MainMenuComponent(generateFilters()).getElement(), appConst.RenderPosition.BEFOREEND);
// Отрисовка компонента - Меню сортировки
render(siteMainElement, new SortMenuComponent().getElement(), appConst.RenderPosition.BEFOREEND);

renderFilms();

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatisticComponent(appConst.MOVIE_COUNT).getElement(), appConst.RenderPosition.BEFOREEND);

const bodyElement = document.querySelector(`body`);
// отрисовка подробностей о фильме
render(bodyElement, new FilmPopupComponent(filmCards[0]).getElement(), appConst.RenderPosition.BEFOREEND);
