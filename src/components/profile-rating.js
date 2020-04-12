import {RANK_RATINGS} from '../const.js';

/**
 * возвращает звание пользователя
 * @param {number} watchedCount количество просмотров пользователя
 * @return {string}
 */
const getProfileRating = (watchedCount) => {
  return RANK_RATINGS.filter((el, i, arr) => {
    if (i === 0) {
      return watchedCount === el.minWatchCount;
    }
    return i < arr.length - 1
      ? watchedCount > arr[i - 1].minWatchCount && watchedCount <= el.minWatchCount
      : watchedCount >= el.minWatchCount;
  })[0].rank;
};

/**
 * Компонент - Звание пользователя
 * @param {number} watchedCount количество просмотров пользователя
 * @return {string}
 */
export const createProfileRatingTemplate = (watchedCount) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getProfileRating(watchedCount)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
