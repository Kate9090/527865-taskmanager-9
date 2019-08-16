export const getTask = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ][Math.floor(Math.random() * 3)],
  dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': Boolean(Math.round(Math.random())),
    'th': false,
    'fr': false,
    'sa': false,
    'su': false
  },
  tags: new Set(`homework`, `theory`, `practice`, `intensive`, `keks`),
  color: [`black`, `yellow`, `blue`, `green`, `pink`],
  isFavorite: false,
  isArchive: false,
});

export const getFilter = () => ({
  title: [`All`,`Overdue`,`Today`,`Favorites`,`Repeating`,`Tags`,`Archive`],
  count: 5
  // 5this.title.map((item, i)=> i)
});
