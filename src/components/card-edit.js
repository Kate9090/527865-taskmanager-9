import {AbstractComponent} from './abstract-component';

export class TaskEdit extends AbstractComponent {
  constructor({
    color,
    description,
    dueDate,
    isRepeating,
    repeatingDays,
    tags,
    
  }) {
    super();
    this._color = color;
    this._description = description;
    this._dueDate = dueDate;
    this._isRepeating = isRepeating;
    this._repeatingDays = repeatingDays;
    this._tags = tags;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${Object.values(this._repeatingDays).some((it) => it) ? `card--repeat` : `` }">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--archive">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites card__btn--disabled"
            >
              favorites
            </button>
          </div>
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${this._description}</textarea>
            </label>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">yes</span>
                </button>
                <fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${new Date(this._dueDate).toDateString()}"
                    />
                  </label>
                </fieldset>
                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">yes</span>
                </button>
                <fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${Object.keys(this._repeatingDays).map((day) => (`
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-${day}-4"
                        name="repeat"
                        value="${day}"
                        ${this._repeatingDays[day] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-${day}-4"
                        >${day}</label
                      >
                    `)).join(``)}
                  </div>
                </fieldset>
              </div>
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${(Array.from(this._tags).map((tag) => `<span class="card__hashtag-inner">
                      <input
                        type="hidden"
                        name="hashtag"
                        value="${tag}"
                        class="card__hashtag-hidden-input"
                      />
                      <p class="card__hashtag-name">
                        #${tag}
                      </p>
                      <button type="button" class="card__hashtag-delete">
                        delete
                      </button>
                    </span>`.trim())).join(``)}
                </div>
                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>
            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                <input
                  type="radio"
                  id="color-black-4"
                  class="card__color-input card__color-input--black visually-hidden"
                  name="color"
                  value="black"
                />
                <label
                  for="color-black-4"
                  class="card__color card__color--black"
                  data-color-type="black"
                  >black</label
                >
                <input
                  type="radio"
                  id="color-yellow-4"
                  class="card__color-input card__color-input--yellow visually-hidden"
                  name="color"
                  value="yellow"
                />
                <label
                  for="color-yellow-4"
                  class="card__color card__color--yellow"
                  data-color-type="yellow"
                  >yellow</label
                >
                <input
                  type="radio"
                  id="color-blue-4"
                  class="card__color-input card__color-input--blue visually-hidden"
                  name="color"
                  value="blue"
                />
                <label
                  for="color-blue-4"
                  class="card__color card__color--blue"
                  data-color-type="blue"
                  >blue</label
                >
                <input
                  type="radio"
                  id="color-green-4"
                  class="card__color-input card__color-input--green visually-hidden"
                  name="color"
                  value="green"
                />
                <label
                  for="color-green-4"
                  class="card__color card__color--green"
                  data-color-type="green"
                  >green</label
                >
                <input
                  type="radio"
                  id="color-pink-4"
                  class="card__color-input card__color-input--pink visually-hidden"
                  name="color"
                  value="pink"
                />
                <label
                  for="color-pink-4"
                  class="card__color card__color--pink"
                  data-color-type="pink"
                  >pink</label
                >
              </div>
            </div>
          </div>
          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;
  }

  _subscribeOnEvents() {
		this.getElement()
			.querySelector(`.card__hashtag-input`).addEventListener(`keydown`, (evt) => {
			if (evt.key === `Enter`) {
				evt.preventDefault();
				this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `<span class="card__hashtag-inner">
            <input
              type="hidden"
              name="hashtag"
              value="${evt.target.value}"
              class="card__hashtag-hidden-input"
            />
            <p class="card__hashtag-name">
              #${evt.target.value}
            </p>
            <button type="button" class="card__hashtag-delete">
              delete
            </button>
          </span>`);
				evt.target.value = ``;
			}
    });
    
    this.getElement()
			.querySelector(`.card__hashtag-list`).addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.classList.contains(`card__hashtag-delete`) || evt.target.parentNode.contains.class(`card__hashtag-delete`)) {
          evt.target.closest(`.card__hashtag-inner`).innerHTML = ``
        }
      })

    let flagDate = true;
    this.getElement()
			.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, (evt) => {
        evt.preventDefault();
        
        if (flagDate) {
          this.getElement().querySelector(`.card__date-deadline`).style.display = `none`;
          this.getElement().querySelector(`.card__date-status`).innerHTML = `No`
          flagDate = false;
        } else {
          this.getElement().querySelector(`.card__date-deadline`).style.display = `block`;
          this.getElement().querySelector(`.card__date-status`).innerHTML = `yes`
          flagDate = true;
        }
      });

    let flagRepeat = true;
    this.getElement()
      .querySelector(`.card__repeat-toggle`).addEventListener(`click`, (evt) => {
        evt.preventDefault();
        
        if (flagRepeat) {
          this.getElement().querySelector(`.card__repeat-days`).style.display = `none`;
          this.getElement().querySelector(`.card__repeat-status`).innerHTML = `No`
          flagRepeat = false;
        } else {
          this.getElement().querySelector(`.card__repeat-days`).style.display = `block`;
          this.getElement().querySelector(`.card__repeat-status`).innerHTML = `yes`
          flagRepeat = true;
        }
      })
	}
}
