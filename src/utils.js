export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const removeElement = (element) => {
  element.parentNode.removeChild(element);
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const TasksCount = {
  MAX: 20,
  LOAD: 8,
  PARTIALLY_CARDS_COUNT: 6
};

export const Action = {
  DELETE: `delete`,
  CREATE: `create`,
  UPDATE: `update`
};

export const ButtonText = {
  SAVING: `Saving....`,
  DELETING: `Deleting....`,
  SAVE: `Save`,
  DELETE: `Delete`
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};
