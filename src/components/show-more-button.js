import AbstractComponent from "./abstract-component.js";

/** Компонент кнопки "Show more"
 * @extends AbstractComponent
 */
export default class ShowMoreButtonComponent extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}
