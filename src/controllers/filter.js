import FilterMenuComponent from '../components/filter-menu.js';
import {FilterType} from '../const.js';
import {RenderPosition} from '../utils/render.js';

/** Контроллер фильтра фильмов */
export default class FilterController {
  /**
   * @constructor
   * @param {Element} container - Контейнер для меню фильтров
   * @param {Movies} movieModels - Модель с данными фильмов
   */
  constructor(container, movieModels) {
    this._container = container;
    this._movieModels = movieModels;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = new FilterMenuComponent(this._container, RenderPosition.AFTERBEGIN);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);


    this._movieModels.setDataChangeHandler(this._onDataChange);
  }

  /**
   * Отрисовка меню фильтров
   */
  render() {
    this._filterComponent.filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: this._movieModels.getMoviesByFilter(filterType).length,
        checked: filterType === this._activeFilterType
      };
    });

  }

  /**
   * Обработчик изменения данных
   * @private
   */
  _onDataChange() {
    this.render();
  }

  /**
   * Обработчик изменения фильтрации
   * @param {FilterType} filterType - Тип фильтрации
   * @private
   */
  _onFilterChange(filterType) {
    this._movieModels.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

}
