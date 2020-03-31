"use strict";

const FILM_CARDS_COUNT = 5;
const EXTRA_FILM_CARDS_COUNT = 2;

/**
 * Компонент - Звание пользователя
 * @return {string}
 */
const createProfileRatingTemplate = () => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">Movie Buff</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

/**
 * Компонент - Меню
 * @return {string}
 */
const createMainMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

/**
 * Компонент - Меню сортировки
 * @return {string}
 */
const createSortMenuTemplate = () => {
  return (
    `<ul class="sort">
       <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
       <li><a href="#" class="sort__button">Sort by date</a></li>
       <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

/**
 * Компонент - Контент-контейнер
 * @return {string}
 */
const createFilmsTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">
        </div>
      </section>
    </section>`
  );
};

/**
 * Компонент - Карточка фильма
 * @return {string}
 */
const createFilmCardTemplate = () => {
  return (
    `<article class="film-card">
      <h3 class="film-card__title">The Dance of Life</h3>
      <p class="film-card__rating">8.3</p>
      <p class="film-card__info">
        <span class="film-card__year">1929</span>
        <span class="film-card__duration">1h 55m</span>
        <span class="film-card__genre">Musical</span>
      </p>
      <img src="./images/posters/the-dance-of-life.jpg" alt="" class="film-card__poster">
      <p class="film-card__description">Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…</p>
      <a class="film-card__comments">5 comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

/**
 * Компонент - Кнопка «Show more»
 * @return {string}
 */
const createShowMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

/**
 * Компонент - Экстра контент-контейнер
 * @param {String} header заголовок блока
 * @return {string}
 */
const createExtraFilmsTemplate = (header) => {
  return (
    `<section class="films-list--extra">
       <h2 class="films-list__title">` + header + `</h2>
       <div class="films-list__container">
       </div>
     </section>`
  );
};

/**
 * Компонент - Количество фильмов
 * @return {string}
 */
const createFooterStatisticsTemplate = () => {
  return (
    `<p>130 291 movies inside</p>`
  );
};


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
