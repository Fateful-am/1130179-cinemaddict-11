import {RenderPosition, MONTH_NAMES} from "./const.js";

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
 * Возвращает дату в формате 30 March 1945
 * @param {Date} date
 * @return {string}
 */
const formatDateDDMMMMYYYY = (date) => {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
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
 * Функция для создания DOM-элемента
 * @param {String} template Шаблон разметки
 * @return {ChildNode} DOM-элемент созданный по шаблону
 */
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * Функция рендеринга компонента
 * @param {Element} container Контейнер для шаблона
 * @param {Element} element HTML-компонент для вставки
 * @param {InsertPosition} place Место вставки
 */
const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {getRandomArrayItem, getRandomIntegerNumber, getRandomArrayIndex, formatDateDDMMMMYYYY, createElement, render};
