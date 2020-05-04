import AbstractRenderComponent from './abstract-render-component';
import {StatisticsPeriod} from '../const';
import moment from 'moment';

export default class Statistics extends AbstractRenderComponent {
  constructor(container, place, moviesModel) {
    super(container, place);

    this._moviesModel = moviesModel;
    this._activeStatisticsPeriod = StatisticsPeriod.ALL_TIME;

    this.render();
  }

  _getStatisticPeriodMarkup(statisticPeriod) {
    const isChecked = statisticPeriod === this._activeStatisticsPeriod ? ` checked` : ``;
    const label = statisticPeriod.charAt(0).toUpperCase() + statisticPeriod.slice(1).replace(`-`, ` `);

    return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${statisticPeriod}" value="${statisticPeriod}" ${isChecked}>
      <label for="statistic-${statisticPeriod}" class="statistic__filters-label">${label}</label>`;
  }

  getTemplate() {
    const statisticsPeriodsMarkup = Object.values(StatisticsPeriod).map((it) => this._getStatisticPeriodMarkup(it)).join(`\n`);
    const {watchedCount, duration, genresStatistics} = this._moviesModel.getStatistics();
    const topGenre = genresStatistics[0].name;
    const rank = `Sci-Fighter`;

    const durationHours = Math.floor(moment.duration(duration, `m`).asHours());
    const durationMinutes = moment.duration(duration, `m`).minutes();
    return (
      `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        ${statisticsPeriodsMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
    );
  }
}
