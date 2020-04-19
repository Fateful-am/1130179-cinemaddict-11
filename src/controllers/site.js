import ProfileRatingComponent from '../components/profile-rating';
import {RenderPosition} from '../utils/render';
import * as appConst from '../const.js';

export default class SiteController {
  constructor() {
    this._body = document.querySelector(`body`);
    this._header = this._body.querySelector(`header`);
    this._main = this._body.querySelector(`main`);
    this._footer = this._body.querySelector(`footer`);

    this.profileRatingComponent = new ProfileRatingComponent(this._header, RenderPosition.BEFOREEND);
    this.profileRatingComponent.watchedCount = appConst.USER_WATCHED_COUNT;
  }

  get body() {
    return this._body;
  }

  get header() {
    return this._header;
  }

  get main() {
    return this._main;
  }

  get footer() {
    return this._footer;
  }

  render() {

  }
}
