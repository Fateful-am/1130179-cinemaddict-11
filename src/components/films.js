import {createFilmsListTemplate} from './films-list.js';
/**
 * Компонент - Контент-контейнер
 * @return {string}
 */
export const createFilmsTemplate = () => {
  const filmsList = createFilmsListTemplate(false, `All movies. Upcoming`);
  return (
    `<section class="films">
      ${filmsList}
    </section>`
  );
};

