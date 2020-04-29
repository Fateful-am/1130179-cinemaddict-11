import AbstractComponent from "./abstract-component.js";
import {render} from "../utils/render.js";

/** Абстрактный класс для компонентов с рендерингом
 * @extends AbstractComponent
 */
export default class AbstractRenderComponent extends AbstractComponent {
  /**
   * @constructor
   * @param {Element} container - Контейнер для компонента
   * @param {InsertPosition} place - Место вставки компонента
   */
  constructor(container, place) {
    super();
    this._container = container;
    this._place = place;
  }

  /**
   * @abstract
   * Должен возвращать шаблон компонента
   * @return {string} шаблон компонента
   */
  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  /**
   * Восстанавливает слушателей событий после ререндеринга
   */
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  /**
   * Отрисовывает компонент
   */
  render() {
    render(this._container, this, this._place);
  }

  /**
   * Ререндерит компонент
   */
  reRender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }

  /**
   * Удаляет компонент
   */
  remove() {
    this.getElement().remove();
    this.removeElement();
  }
}
