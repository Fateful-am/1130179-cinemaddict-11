import moment from 'moment';

/**
 * Возвращает случайный элемент массива
 * @param {Array} array Входной массив
 * @return {*}
 */
const getRandomArrayItem = (array) => {
  const randomIndex = getRandomArrayIndex(array);

  return array[randomIndex];
};

/**
 * Возвращает случайный индекс массива
 * @param {Array} array Входной массив
 * @return {*}
 */
const getRandomArrayIndex = (array) => {
  return getRandomIntegerNumber(0, array.length);
};

/**
 * Возвпащает случайное целое число в пределах аргуметов
 * @param {number} min Нижний предел
 * @param {number} max Верхний предел
 * @return {*}
 */
const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

/**
 * Форматирование продолжительности фильма
 * @param {number} duration Продолжительность фильма в минутах
 * @return {string} Отформатированная строка с продолжительностью фильма
 */
const formatDuration = (duration) => {
  return moment.utc(moment.duration(duration, `minutes`).asMilliseconds()).format(`H[h] m[m]`);
};

export {getRandomArrayItem, getRandomIntegerNumber, getRandomArrayIndex, formatDuration};
