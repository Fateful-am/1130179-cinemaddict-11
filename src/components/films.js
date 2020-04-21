import AbstractRenderComponent from './abstract-render-component';

/** Компонент фильмотеки
 * @extends AbstractRenderComponent
 */
export default class FilmsComponent extends AbstractRenderComponent {
  constructor(container, place) {
    super(container, place);

    this.render();
  }

  getTemplate() {
    return `<section class="films"></section>`;
  }
}
