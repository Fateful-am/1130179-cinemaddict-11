import AbstractRenderComponent from './abstract-render-component';

/** Компонент заглушки при отсутствии фильмов
 * @extends AbstractComponent
 */
export default class NoFilms extends AbstractRenderComponent {

  getTemplate() {
    return `<h2 class="films-list__title">There are no movies in our database</h2>`;
  }

  recoveryListeners() {}

}
