/**
 * Генерирует разметку пункта меню фильтра
 * @param {{name: string, count: number}} filter Объект с параметрамерами фильтра
 * @param {boolean} isActive Признак активности пункта меню
 * @return {string} Разметка пункта меню фильтра
 */
const createFilterMarkup = (filter, isActive) => {
  const {name, count} = filter;
  const activeClass = isActive ? `main-navigation__item--active` : ``;
  return (
    `<a href="#${name.lower}" class="main-navigation__item ${activeClass}">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

/**
 * Компонент - Меню
 * @param {{name: string, count: number}[]} filters Массив фильтров
 * @return {string} Разметка меню фильтров
 */
export const createMainMenuTemplate = (filters) => {
  const filterMarkup = filters.slice(1).map((it) => createFilterMarkup(it, false)).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">${filters[0].name}</a>
        ${filterMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};


