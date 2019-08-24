export const makeFilterTemplate = (filters) => (
  `<section class="main__filter filter container">
    ${filters.map((filter) => `<input
        type="radio"
        id="filter__all"
        class="filter__input visually-hidden"
        name="filter"
        checked
      />
      <label for="filter__all" class="filter__label">${filter.title}<span class="filter__all-count">${filter.getValue()}</span></label>`).join(``)}
  </section>`
);
