import AbstractComponent from "./abstract-component.js";
import {render, reRender} from "../utils/render.js";


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

  render() {
    render(this._container, this, this._place);
  }

  reRender() {
    reRender(this, this._place);
  }
}
