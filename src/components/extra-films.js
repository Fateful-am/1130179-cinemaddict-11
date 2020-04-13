import {createFilmsListTemplate} from './films-list.js';

/**
 * Компонент - Экстра контент-контейнер
 * @param {String} header заголовок блока
 * @return {string}
 */
export const createExtraFilmsTemplate = (header) => {
  const filmsList = createFilmsListTemplate(true, header);
  return (
    `${filmsList}`
  );
};
