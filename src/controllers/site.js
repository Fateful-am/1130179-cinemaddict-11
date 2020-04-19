import ProfileRatingComponent from '../components/profile-rating';
import FilterMenuComponent from '../components/filter-menu.js';
import SortMenuComponent from '../components/sort-menu.js';

import {RenderPosition} from '../utils/render';
// import * as appConst from '../const.js';

export default class SiteController {
  constructor() {
    this._body = document.querySelector(`body`);
    this._header = this._body.querySelector(`header`);
    this._main = this._body.querySelector(`main`);
    this._footerStatistics = this._body.querySelector(`.footer__statistics`);

    this.profileRatingComponent = new ProfileRatingComponent(this._header, RenderPosition.BEFOREEND);
    this.filterMenu = new FilterMenuComponent(this._main, RenderPosition.AFTERBEGIN);
    this._sortMenu = new SortMenuComponent(this._main, RenderPosition.BEFOREEND);
  }

  get body() {
    return this._body;
  }
}
