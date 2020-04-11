import {getRandomArrayIndex, getRandomIntegerNumber, getRandomArrayItem} from "../utils.js";
import {GENRES} from "../const";

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

// Согласованный с filmTitles массив постеров к фильмам
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

// Минимальное количество предложений в случайном описании фильма
const MIN_DESCRIPTION_SENTENCES_COUNT = 1;
// Максимальное количество предложений в случайном описании фильма
const MAX_DESCRIPTION_SENTENCES_COUNT = 5;
// Максимальная длина описания фильма
const MAX_DESCRIPTION_LENGTH = 140;

/**
 * Возвращает случайно сгенерированную строку описания фильма (для моки)
 * @return {string}
 */
const getRandomSDescription = () => {
  const sentencesCount = getRandomIntegerNumber(MIN_DESCRIPTION_SENTENCES_COUNT, MAX_DESCRIPTION_SENTENCES_COUNT);
  const descriptions = [];
  for (let i = 1; i <= sentencesCount; i++) {
    descriptions.push(getRandomArrayItem(filmDescriptions).trim());
  }
  return `${descriptions.join(`. `)}.`;
};

/**
 * Возвращает отформатированную строку с продолжительностью фильма
 * @param {number} duration Продолжительность фильма в минутах
 * @return {string}
 */
const formatDuration = (duration) => {
  const hour = Math.trunc(duration / 60);
  const minute = duration % 60;
  return `${hour === 0 ? `` : `${hour}h`}${minute === 0 ? `` : ` ${minute}m`}`;
};

/**
 * Возвращает отформаттрованную строку согласно ТЗ
 * @param {string} description входная строка
 * @return {string}
 */
const formatDescription = (description) => {
  return description.length > MAX_DESCRIPTION_LENGTH ? `${description.substr(0, MAX_DESCRIPTION_LENGTH - 1)}…` : description;
};

const generateFilmCard = ()=> {
  const filmIndex = getRandomArrayIndex(filmTitles);
  return {
    title: filmTitles[filmIndex],
    rating: `${getRandomIntegerNumber(1, 9)}.${getRandomIntegerNumber(0, 9)}`,
    year: getRandomIntegerNumber(1929, 1964),
    duration: formatDuration(getRandomIntegerNumber(5, 119)),
    genre: getRandomArrayItem(GENRES),
    poster: filmPosters[filmIndex],
    description: formatDescription(getRandomSDescription()),
    commentsCount: 5,
    addedToWatchlist: Math.random() > 0.5,
    markedAsWatched: Math.random() > 0.5,
    addedToFavorite: Math.random() > 0.5,
  };
};

/**
 * Генерация карточек фильмов
 * @param {number} count Количество карточек
 * @return {{duration: string, year: *, addedToFavorite: boolean, commentsCount: number, markedAsWatched: boolean,
 * rating: string, genre: *, description: string, addedToWatchlist: boolean, title: string, poster: string}[]}
 */
const generateFilmCards = (count)=> {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};

export {generateFilmCard, generateFilmCards};
