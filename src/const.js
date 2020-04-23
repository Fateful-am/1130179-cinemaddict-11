// Список имен фильтров
export const FILTER_NAMES = [`All movies`, `Watchlist`, `History`, `Favorites`];
// Жанры фильмов
export const GENRES = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`, `Film-Noir`, `Sci-Fi`];
// Максимальная длина описания фильма
export const MAX_DESCRIPTION_LENGTH = 140;
// Количество карточек фильмов в экстра контейнере
export const EXTRA_FILM_CARDS_COUNT = 2;
// Общее количество карточек фильмов
export const FILM_CARDS_COUNT = 14;
// Количество карточек фильмов показываемых при старте
export const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
// Количество карточек фильмов добавляемых при нажатии на кнопку "Load More"
export const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;
// Количество крточек фильмов на сервере
export const MOVIE_COUNT = 130291;
// Количество просотренных пользователем фильмов
export const USER_WATCHED_COUNT = 25;
// Именованные месяцы
export const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

// Массив объектов с званием пользователя
export const RANK_RATINGS = [
  {rank: ``, minWatchCount: 0},
  {rank: `novice`, minWatchCount: 10},
  {rank: `fan`, minWatchCount: 20},
  {rank: `movie buff`, minWatchCount: 21}
];
