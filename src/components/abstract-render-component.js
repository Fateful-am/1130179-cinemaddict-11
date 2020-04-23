import AbstractComponent from "./abstract-component.js";
import {render} from "../utils/render.js";


export default class AbstractRenderComponent extends AbstractComponent {
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

  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  render() {
    render(this._container, this, this._place);
  }

  reRender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
