// Список имен фильтров
export const FilterType = {
  ALL: `All movies`,
  WATCH_LIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
  STATS: `Stats`
};

// Список сортировки
export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

// Список периодов статистики
export const StatisticsPeriod = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

// Жанры фильмов
export const GENRES = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`, `Film-Noir`, `Sci-Fi`];
// Максимальная длина описания фильма
export const MAX_DESCRIPTION_LENGTH = 140;
// Количество карточек фильмов в экстра контейнере
export const EXTRA_FILM_CARDS_COUNT = 2;
// Общее количество карточек фильмов
export const FILM_CARDS_COUNT = 41;
// Количество карточек фильмов показываемых при старте
export const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
// Количество карточек фильмов добавляемых при нажатии на кнопку "Load More"
export const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;
// Количество крточек фильмов на сервере
export const MOVIE_COUNT = 130291;
// Количество просотренных пользователем фильмов
export const USER_WATCHED_COUNT = 25;

// Массив объектов с званием пользователя
export const RANK_RATINGS = [
  {rank: ``, minWatchCount: 0},
  {rank: `novice`, minWatchCount: 10},
  {rank: `fan`, minWatchCount: 20},
  {rank: `movie buff`, minWatchCount: 21}
];
/**
 * возвращает звание пользователя
 * @param {number} watchedCount количество просмотров пользователя
 * @return {string}
 */
export const getProfileRating = (watchedCount) =>{
  return RANK_RATINGS.filter((it, i, array) => {
    if (i === 0) {
      return watchedCount === it.minWatchCount;
    }
    return i < array.length - 1
      ? watchedCount > array[i - 1].minWatchCount && watchedCount <= it.minWatchCount
      : watchedCount >= it.minWatchCount;
  })[0].rank;
};
