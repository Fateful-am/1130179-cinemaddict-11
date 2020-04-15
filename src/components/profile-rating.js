import {RANK_RATINGS} from '../const.js';
import {createElement} from "../utils.js";

export default class ProfileRatingComponent {
  constructor(watchedCount) {
    this._watchedCount = watchedCount;

    this._element = null;
  }

  /**
   * возвращает звание пользователя
   * @param {number} watchedCount количество просмотров пользователя
   * @return {string}
   */
  _getProfileRating(watchedCount) {
    return RANK_RATINGS.filter((it, i, array) => {
      if (i === 0) {
        return watchedCount === it.minWatchCount;
      }
      return i < array.length - 1
        ? watchedCount > array[i - 1].minWatchCount && watchedCount <= it.minWatchCount
        : watchedCount >= it.minWatchCount;
    })[0].rank;
  }

  getTemplate() {
    const profileRating = this._getProfileRating(this._watchedCount);
    return (
      `<section class="header__profile profile">
      <p class="profile__rating">${profileRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
