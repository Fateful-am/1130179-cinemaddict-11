import {getProfileRating} from '../const.js';
import AbstractRenderComponent from './abstract-render-component';

/** Компонент райтинга пользователя
 * @extends AbstractRenderComponent
 */
export default class ProfileRatingComponent extends AbstractRenderComponent {
  constructor(container, place) {
    super(container, place);

    this._watchedCount = 0;
    this.render();
  }


  getTemplate() {
    const profileRating = getProfileRating(this._watchedCount);
    return (
      `<section class="header__profile profile">
      <p class="profile__rating">${profileRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
    );
  }

  /**
   * Установка количества фильмов просмотренных пользователем
   * @param {number} value - Количество фильмов просмотренных пользователем
   */
  set watchedCount(value) {
    this._watchedCount = value;
    this.reRender();
  }

  recoveryListeners() {}

}
