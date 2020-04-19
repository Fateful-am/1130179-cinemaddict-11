import ProfileRatingComponent from '../components/profile-rating';
import FilterMenuComponent from '../components/filter-menu.js';
import SortMenuComponent from '../components/sort-menu.js';
import FooterStatisticComponent from '../components/footer-statistics.js';
import FilmsComponent from '../components/films.js';
import FilmsBoardController from './films-board.js';

import {RenderPosition} from '../utils/render';
// import * as appConst from '../const.js';

export default class SiteController {
  constructor() {
    this._body = document.querySelector(`body`);
    this._header = this._body.querySelector(`header`);
    this._main = this._body.querySelector(`main`);
    this._footerStatistics = this._body.querySelector(`.footer__statistics`);

    this.profileRatingComponent = new ProfileRatingComponent(this._header, RenderPosition.BEFOREEND);
    this.filterMenuComponent = new FilterMenuComponent(this._main, RenderPosition.AFTERBEGIN);
    this._sortMenuComponent = new SortMenuComponent(this._main, RenderPosition.BEFOREEND);
    this.footerStatisticsComponent = new FooterStatisticComponent(this._footerStatistics, RenderPosition.BEFOREEND);
    this._filmsComponent = new FilmsComponent(this._main, RenderPosition.BEFOREEND);

    this.filmsBoardController = new FilmsBoardController(this._filmsComponent.getElement(), this._body);
  }

  renderFilms(films) {
    this.filmsBoardController.render(films);
  }
}
