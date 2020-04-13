/**
 * Шаблон списка фильмов
 * @param {boolean} isExtra Если true указывает на дополнительный список фильмов
 * @param {string} title Заголовок списка
 * @return {string}
 */
export const createFilmsListTemplate = (isExtra, title) => {
  return (
    `<section class="films-list${isExtra ? `--extra` : ``}">
      <h2 class="films-list__title ${isExtra ? `` : `visually-hidden`}">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

