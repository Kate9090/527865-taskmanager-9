
import {Task} from '../components/card';
import {TaskEdit} from '../components/card-edit';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

import {render, Position} from '../utils';

export const Mode = {
  ADD: `add`,
  DEFAULT: `default`
}

export default class TaskController {
  constructor(container, data, mode, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._taskView = new Task(data);
    this._taskEdit = new TaskEdit(data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this.create(mode);
  }

  create(mode) {
    flatpickr(this._taskEdit.getElement().querySelector(`.card__date`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dueDate,
    });
    let currentView = this._taskView;
    let position = Position.BEFOREEND

    if (mode === Mode.ADD) {
      currentView = this._taskEdit;
      position = Position.AFTERBEGIN;
    }
    render(this._container.getElement(), currentView.getElement(), position);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskView.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        this._onChangeView();
        this._container.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`.card__save`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));

        const entry = {
          description: formData.get(`text`),
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
          dueDate: new Date(formData.get(`date`)),
          repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
            acc[it] = true;
            return acc;
          }, {
            'mo': false,
            'tu': false,
            'we': false,
            'th': false,
            'fr': false,
            'sa': false,
            'su': false
          }),
          isFavorites: addToFavorite.classList.contains(`card__btn--disabled`) ? true : false,
          isArchive: addToArchive.classList.contains(`card__btn--disabled`) ? true : false,
        };

        this._onDataChange(entry, this._data);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, () => {
        this._onDataChange(null, this._data);
      });

    const addToFavorite = this._taskEdit.getElement().querySelector(`.card__btn--favorites`);
    const addToArchive = this._taskEdit.getElement().querySelector(`.card__btn--archive`);

    addToFavorite.addEventListener(`click`, (e) => {
      e.preventDefault();
      addToFavorite.classList.toggle(`card__btn--disabled`);
    });

    addToArchive.addEventListener(`click`, (e) => {
      e.preventDefault();
      addToArchive.classList.toggle(`card__btn--disabled`);
    });

  }


  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }
}
