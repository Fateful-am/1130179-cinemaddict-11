import AbstractComponent from "./abstract-component.js";

/** Компонент фильмотеки
 * @extends AbstractComponent
 */
export default class FilmsComponent extends AbstractComponent {
  getTemplate() {
    return `<section class="films"></section>`;
  }
}
