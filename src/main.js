
const FILM_CARDS_COUNT = 5;
const EXTRA_FILM_CARDS_COUNT = 2;

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

// Отрисовка карточек фильмов
for (let i = 0; i < FILM_CARDS_COUNT; i++) {
  render(filmListContainerElement, createFilmCardTemplate(), `beforeend`);
}

// Отрисовка компонента - Кнопка «Show more»
render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

// Отрисовка компонента - Экстра контент-контейнер
render(filmsElement, createExtraFilmsTemplate(`Top rated`), `beforeend`);
render(filmsElement, createExtraFilmsTemplate(`Most commented`), `beforeend`);

const topRatedContainerElement = filmsElement.querySelector(`.films-list--extra:nth-last-child(2) .films-list__container`);
const mostCommentedContainerElement = filmsElement.querySelector(`.films-list--extra:nth-last-child(1) .films-list__container`);

// Отрисовка карточек фильмов Top rated
for (let i = 0; i < EXTRA_FILM_CARDS_COUNT; i++) {
  render(topRatedContainerElement, createFilmCardTemplate(), `beforeend`);
}

// Отрисовка карточек фильмов Most commented
for (let i = 0; i < EXTRA_FILM_CARDS_COUNT; i++) {
  render(mostCommentedContainerElement, createFilmCardTemplate(), `beforeend`);
}

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);
