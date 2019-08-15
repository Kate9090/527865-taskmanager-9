export const makeFilterTemplate = ({
  title,
  count
}) => (
  `<section class="main__filter filter container">
    ${title.map((item) => `<input
        type="radio"
        id="filter__all"
        class="filter__input visually-hidden"
        name="filter"
        checked
      />
      <label for="filter__all" class="filter__label">${item}<span class="filter__all-count">${count}</span></label>`
    ).join(``)}
  </section>`
);
