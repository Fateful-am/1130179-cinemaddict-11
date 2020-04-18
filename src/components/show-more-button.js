import AbstractComponent from "./abstract-component.js";

/** Компонент кнопки "Show more"
 * @extends AbstractComponent
 */
export default class ShowMoreButtonComponent extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }

  /**
   * Устанавливает обработчик клика по кнопке
   * @param {function} handler - КоллБэк-функция
   */
  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

}
