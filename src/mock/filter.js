import {FILTER_NAMES} from '../const.js';

/**
 * Генерация пунктов меню фильтров
 * @return {{name: (string), count: number}[]} name - пункт меню, count - количество удовлятворяющее данному фильтру
 */
export const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * 10),
    };
  });
};
