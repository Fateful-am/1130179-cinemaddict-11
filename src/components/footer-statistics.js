/**
 * Компонент - Количество фильмов
 * @param {number} movieCount количество фильмов в библиотеке
 * @return {string}
 */
export const createFooterStatisticsTemplate = (movieCount) => {
  return (
    `<p>${movieCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1 `)} movies inside</p>`
  );
};

