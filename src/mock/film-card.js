import {getRandomArrayIndex, getRandomIntegerNumber, getRandomArrayItem} from '../utils.js';
import {generateFilmComments} from './comment';
import {GENRES} from '../const';

// Массив названий фильмов
const filmTitles = [
  `Made for Each Other`,
  `Popeye the Sailor Meets Sinbad the Sailor`,
  `Sagebrush Trail`,
  `Santa Claus Conquers the Martians`,
  `The Dance of Life`,
  `The Great Flamarion`,
  `The Man with the Golden Arm`
];

// Согласованный с filmTitles массив картинок файлов постеров к фильмам
const filmPosters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

// Строки с описаниями фильмов
const filmDescriptions = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.
  Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
  Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`.split(`.`);

// Случайные имена режисеров. Источник http://megagenerator.ru/namefio/
const filmDirectors = [
  `Moore Garey`,
  `Richardson Abraham`,
  `Peters Norman`,
  `Jacobs Mark`,
  `Heath Eugene`,
  `Maxwell Preston`,
  `Clark Victor`,
  `Bridges Ethan`,
  `Watkins Matthew`,
  `Daniels Robert`
];

// Случайные имена сценаристов. Источник http://megagenerator.ru/namefio/
const filmWriters = [
  `Jefferson Collin`,
  `Potter Harold`,
  `Jacobs Kenneth`,
  `Flowers Colbert`,
  `Jennings William`,
  `Morris Timothy`,
  `Skinner Cory`,
  `Walsh Ira`,
  `Little William`,
  `Burns Stuart`,
  `Phillips Gerald`,
  `Adams Jeffrey`,
  `Bond Myron`,
  `Fisher Neal`,
  `King Jack`
];

// Случайные имена актеров. Источник http://megagenerator.ru/namefio/
const filmActors = [
  `Cunningham Charles`,
  `Golden Robert`,
  `Stone Paul`,
  `Griffin Ronald`,
  `Hall Peter`,
  `McLaughton Curtis`,
  `Boyd William`,
  `Warner Gregory`,
  `Washington Anthony`,
  `Morgan Robert`,
  `Blankenship Denis`,
  `Gibbs Virgil`,
  `Cummings Christopher`,
  `Black Reginald`,
  `Newton Homer`,
  `Kelley Kelley`,
  `Fox Edward`,
  `Lester John`,
  `Johnson Stephen`,
  `Ferguson Jeffry`
];

// Случайные страны выпустившие фильм. Источник https://ciox.ru/country-generator
const filmCountry = [
  `Korea`,
  `Chad`,
  `Honduras`,
  `Finland`,
  `Maldives`,
  `Anguilla`,
  `Faroe Islands`,
  `Saint Lucia`,
  `USA`,
  `Colombia`,
  `Russia`
];

// Минимальное количество предложений в случайном описании фильма
const MIN_RANDOM_DESCRIPTION_SENTENCES_COUNT = 1;
// Максимальное количество предложений в случайном описании фильма
const MAX_RANDOM_DESCRIPTION_SENTENCES_COUNT = 5;
// Минимальное количество комментариев
const MIN_RANDOM_COMMENTS_COUNT = 0;
// Максимальное количество комментариев
const MAX_RANDOM_COMMENTS_COUNT = 10;
// Максимальное случайное число сценаристов фильма
const MAX_RANDOM_WRITERS_COUNT = 3;
// Минимальное количество актеров в фильме
const MIN_RANDOM_ACTORS_COUNT = 2;
// Максимальное случайное число актеров фильма
const MAX_RANDOM_ACTORS_COUNT = 5;
// Максимальное случайное число жанров фильма
const MAX_RANDOM_GENRES_COUNT = 5;
// Минимальная случайная продолжительность фильма
const MIN_RANDOM_FILM_DURATION = 5;
// Максимальная случайная продолжительность фильма
const MAX_RANDOM_FILM_DURATION = 119;
// Минимальный случайный год выхода фильма
const MIN_RANDOM_FILM_YEAR_RELEASE = 1929;
// Максимальный случайный год выхода фильма
const MAX_RANDOM_FILM_YEAR_RELEASE = 1964;
// Минимальный случайный рейтинг фильма
const MIN_RANDOM_FILM_RATE = 1;
// Максимальный случайный рейтинг фильма
const MAX_RANDOM_FILM_RATE = 10;

/**
 * Генерация склеенной из масссива строки с разделителем
 * @param {Array} array Входной массив
 * @param {number} rangeCountMin Минимальное количество элементов массива на выходе
 * @param {number} rangeCountMax Максимальное количество элементов массива на выходе
 * @param {string} joinDelimiter Разделитель
 * @return {string} Склееная строка из входного массива
 */
const getJoinRandomArrayElements = (array, rangeCountMin, rangeCountMax, joinDelimiter) => {
  const memberCount = getRandomIntegerNumber(rangeCountMin, rangeCountMax);
  const tempArray = [];
  for (let i = 1; i <= memberCount; i++) {
    tempArray.push(getRandomArrayItem(array).trim());
  }
  return tempArray.join(`${joinDelimiter} `);
};

/**
 * Генерация описания фильма
 * @return {string} Описание фильма, разделитель - точка
 */
const getRandomSDescription = () => {
  return getJoinRandomArrayElements(filmDescriptions, MIN_RANDOM_DESCRIPTION_SENTENCES_COUNT, MAX_RANDOM_DESCRIPTION_SENTENCES_COUNT, `.`);
};

/**
 * Генерация сценаристов фильма
 * @return {string} Сценаристы, разделитель - запятая
 */
const getRandomWriters = () => {
  return getJoinRandomArrayElements(filmWriters, 2, MAX_RANDOM_WRITERS_COUNT, `,`);
};

/**
 * Генерация актерского состава фильма
 * @return {string} Актерский состав, разделитель - запятая
 */
const getRandomActors = () => {
  return getJoinRandomArrayElements(filmActors, MIN_RANDOM_ACTORS_COUNT, MAX_RANDOM_ACTORS_COUNT, `,`);
};

/**
 * Генерация набора жанров фильма
 * @return {string} Жанры фильмов, разделитель - пробел
 */
const getRandomGenres = () => {
  return getJoinRandomArrayElements(GENRES, 1, MAX_RANDOM_GENRES_COUNT, ``);
};

/**
 * Генерация даты выхода фильма
 * @param {number} yearFrom Минимальный год выхода фильма
 * @param {number} yearTo Максимальный год выхода фильма
 * @return {Date} Дата выхода фильма
 */
const getRandomReleaseDate = (yearFrom, yearTo) => {
  const targetDate = new Date();
  targetDate.setFullYear(getRandomIntegerNumber(yearFrom, yearTo), getRandomIntegerNumber(1, 12), getRandomIntegerNumber(1, 28));
  return targetDate;
};

/**
 * Форматирование продолжительности фильма
 * @param {number} duration Продолжительность фильма в минутах
 * @return {string} Отформатированная строка с продолжительностью фильма
 */
const formatDuration = (duration) => {
  const hour = Math.trunc(duration / 60);
  const minute = duration % 60;
  return `${hour === 0 ? `` : `${hour}h`}${minute === 0 ? `` : ` ${minute}m`}`;
};

/**
 * Генератор карточки фильма
 * @return {{country: string, comments: {date: string, emoji: string, author: string, text: string}[],
 * releaseDate: Date, director: string, markedAsWatched: boolean, rating: string, description: string,
 * addedToWatchlist: boolean, writers: string, title: string, originTitle: string, duration: string,
 * actors: string, addedToFavorite: boolean, genres: string, poster: string, age: number}} Объект карточки фильма:
 * country - Страна, comments - Отсортированный по дате массив коментариев,
 * releaseDate - Дата и год релиза в формате день месяц год, director - Режиссёр, markedAsWatched - Признак просмотра,
 * rating - Рейтинг, description - Полное описание, addedToWatchlist - Признак фильм к просомтру,
 * writers - Сценаристы, title - Название фильма, originTitle - Оригинальное название фильма,
 * duration - Продолжительность , actors - Актёрский состав, addedToFavorite - Признак любимый фильм,
 * genres - Жанр, poster - имя файла картинки постера, age - Возрастной рейтинг
 */
const generateFilmCard = ()=> {
  const filmIndex = getRandomArrayIndex(filmTitles);
  return {
    country: getRandomArrayItem(filmCountry),
    comments: generateFilmComments(getRandomIntegerNumber(MIN_RANDOM_COMMENTS_COUNT, MAX_RANDOM_COMMENTS_COUNT))
      .sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } if (a.date > b.date) {
          return -1;
        } return 0;
      }),
    releaseDate: getRandomReleaseDate(MIN_RANDOM_FILM_YEAR_RELEASE, MAX_RANDOM_FILM_YEAR_RELEASE),
    director: getRandomArrayItem(filmDirectors),
    markedAsWatched: Math.random() > 0.5,
    rating: `${getRandomIntegerNumber(MIN_RANDOM_FILM_RATE, MAX_RANDOM_FILM_RATE - 1)}.${getRandomIntegerNumber(0, 9)}`,
    title: filmTitles[filmIndex],
    originTitle: filmTitles[filmIndex],
    writers: getRandomWriters(),
    actors: getRandomActors(),
    duration: formatDuration(getRandomIntegerNumber(MIN_RANDOM_FILM_DURATION, MAX_RANDOM_FILM_DURATION)),
    genres: getRandomGenres(),
    poster: filmPosters[filmIndex],
    description: `${getRandomSDescription()}.`,
    addedToWatchlist: Math.random() > 0.5,
    addedToFavorite: Math.random() > 0.5,
    age: getRandomIntegerNumber(0, 18)
  };
};

/**
 * Генерация карточек фильмов
 * @param {number} count Количество карточек
 * @return {{country: string, comments: {date: string, emoji: string, author: string, text: string}[],
 * releaseDate: Date, director: string, markedAsWatched: boolean, rating: string, description: string,
 * addedToWatchlist: boolean, writers: string, title: string, originTitle: string, duration: string,
 * actors: string, addedToFavorite: boolean, genres: string, poster: string, age: number}[]} Массив карточек фильмов
 */
const generateFilmCards = (count)=> {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};

export {generateFilmCard, generateFilmCards};
