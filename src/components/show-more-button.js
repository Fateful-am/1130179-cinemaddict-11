import AbstractRenderComponent from './abstract-render-component';

/** Компонент кнопки "Show more"
 * @extends AbstractRenderComponent
 */
export default class ShowMoreButtonComponent extends AbstractRenderComponent {
  constructor(container, place) {
    super(container, place);

    this._clickHandler = null;
    this.render();
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }

  /**
   * Устанавливает обработчик клика по кнопке
   * @param {function} handler - КоллБэк-функция
   */
  setClickHandler(handler) {
    if (this._clickHandler) {
      this.getElement().removeEventListener(`click`, this._clickHandler);
    }
    this._clickHandler = handler;
    this.getElement().addEventListener(`click`, handler);
  }

  recoveryListeners() {
    this.setClickHandler(this._clickHandler);
  }
}
