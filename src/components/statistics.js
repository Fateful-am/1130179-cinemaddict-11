import AbstractRenderComponent from './abstract-render-component';
import {StatisticsPeriod} from '../const';
import moment from 'moment';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';


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
    const {watchedCount, duration, genresStatistics} = this._moviesModel.getStatistics(this._activeStatisticsPeriod);

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

  render() {
    super.render();
    this._chart = this.renderChart();
    this._setFilterItemClick();
  }

  reRender() {
    super.reRender();
    this._chart = this.renderChart();
  }

  _setFilterItemClick() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `LABEL`) {
        return;
      }
      this._activeStatisticsPeriod = evt.target.htmlFor.split(`-`)[1];
      this.reRender();
    });
  }

  recoveryListeners() {
    this._setFilterItemClick();
  }

  hide() {
    super.hide();
    this._activeStatisticsPeriod = StatisticsPeriod.ALL_TIME;
  }

  show() {
    super.show();
    this.reRender();
  }

  renderChart() {
    if (this._chart) {
      this._chart.destroy();
    }
    const {genresStatistics} = this._moviesModel.getStatistics(this._activeStatisticsPeriod);
    const BAR_HEIGHT = 50;
    const statisticCtx = document.querySelector(`.statistic__chart`);

    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы

    if (genresStatistics.length === 1 && genresStatistics[0].name === ``) {
      statisticCtx.height = 0;
      return null;
    }
    statisticCtx.height = BAR_HEIGHT * genresStatistics.length;

    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: genresStatistics.map((it) => it.name),
        datasets: [{
          data: genresStatistics.map((it) => it.count),
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }
}
