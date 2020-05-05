import {createElement} from "../utils/render.js";

const HIDDEN_CLASS = `visually-hidden`;

/** Абстрактный класс для компонентов */
export default class AbstractComponent {
  /**
   * Конструктор класса
   */
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);

    }
    this._element = null;
  }

  /**
   * @abstract
   * Должен возвращать шаблон компонента
   */
  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  /**
   * Возвращвет элемент компонента
   * @return {Element} - DOM-элемент
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * Освобождает ресурсы элемента
   */
  removeElement() {
    this._element = null;
  }

  show() {
    if (this._element) {
      this._element.classList.remove(HIDDEN_CLASS);
    }
  }

  hide() {
    if (this._element) {
      this._element.classList.add(HIDDEN_CLASS);
    }
  }
}
