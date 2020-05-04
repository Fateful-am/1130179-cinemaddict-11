import FilterMenuComponent from '../components/filter-menu.js';
import {FilterType} from '../const.js';
import {RenderPosition} from '../utils/render.js';

export default class FilterController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = new FilterMenuComponent(this._container, RenderPosition.AFTERBEGIN);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);


    this._movieModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    this._filterComponent.filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: this._movieModel.getMoviesByFilter(filterType).length,
        checked: filterType === this._activeFilterType
      };
    });

  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._movieModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

}
