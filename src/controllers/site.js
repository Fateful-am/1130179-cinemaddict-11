import ProfileRatingComponent from '../components/profile-rating';
import FilterController from './filter.js';
import SortMenuComponent from '../components/sort-menu.js';
import FooterStatisticComponent from '../components/footer-statistics.js';
import FilmsComponent from '../components/films.js';
import FilmsBoardController from './films-board.js';

import {RenderPosition} from '../utils/render';

/** Контроллер индексной страницы */
export default class SiteController {
  /**
   * @constructor
   * @param {Movies} moviesModel - Модель фильмов
   * @param {Provider} api - Правайдер с api
   */
  constructor(moviesModel, api) {
    this._moviesModel = moviesModel;
    this._api = api;
    this._body = document.querySelector(`body`);
    this._header = this._body.querySelector(`header`);
    this._main = this._body.querySelector(`main`);
    this._footerStatistics = this._body.querySelector(`.footer__statistics`);

    this.profileRatingComponent = new ProfileRatingComponent(this._header, RenderPosition.BEFOREEND);
    this._filterController = new FilterController(this._main, moviesModel);
    this._sortMenuComponent = new SortMenuComponent(this._main, RenderPosition.BEFOREEND);
    this._footerStatisticsComponent = new FooterStatisticComponent(this._footerStatistics, RenderPosition.BEFOREEND);
    this._filmsComponent = new FilmsComponent(this._main, RenderPosition.BEFOREEND);

    this._filmsBoardController = new FilmsBoardController(this, this._filmsComponent, this._body, this._sortMenuComponent, this._moviesModel, this._api);
  }

  /**
   * Отрисовка фильмов
   */
  renderFilms() {
    this._filterController.render();
    this._filmsBoardController.render();
    this._footerStatisticsComponent.movieCont = this._moviesModel.getMovieCount();
    this.profileRatingComponent.watchedCount = this._moviesModel.getWatchedCount();
  }
}
