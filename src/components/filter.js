export const makeFilterTemplate = (filter) => (
  `<section class="main__filter filter container">
    ${filter.map((item) => `<input
        type="radio"
        id="filter__all"
        class="filter__input visually-hidden"
        name="filter"
        checked
      />
      <label for="filter__all" class="filter__label">${item.title}<span class="filter__all-count">${item.count}</span></label>`).join(``)}
  </section>`
);
