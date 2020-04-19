/**
 * Константы для вставки DOM-элементов
 * @type {{BEFOREEND: InsertPosition, AFTERBEGIN: InsertPosition}}
 */
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

/**
 * Генерация DOM-элемента на основе шаблона
 * @param {String} template - Шаблон элемента
 * @return {Element} - DOM-элемент
 */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * Отрисовка элемента в контейнере
 * @param {Element} container - Контейнер для элемента
 * @param {AbstractComponent} component - Компонент для отрисовки
 * @param {InsertPosition} place - Место вставки элемента в контейнер
 */
export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

/**
 * Переотрисовывает компонент новым содержимым
 * @param {AbstractComponent} component - Компонент для отрисовки
 * @param {InsertPosition} place - Место вставки элемента в контейнер
 */
export const reRender = (component, place) => {
  const element = component.getElement();
  const container = element.parentElement;

  element.innerHTML = ``;

  render(container, component, place);
};

/**
 * Заменяет один элемент на другой в родительском контейнере
 * @param {AbstractComponent} newComponent - Новый элемент
 * @param {AbstractComponent} oldComponent - Старый элемент
 */
export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};


/**
 * Удаляет элемент из разметки
 * @param {AbstractComponent} component - Компонент для удаления
 */
export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};
