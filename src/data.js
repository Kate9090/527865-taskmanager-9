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
  tags: new Set([`homework`, `theory`, `practice`, `intensive`, `keks`]),
  color: [`black`, `yellow`, `blue`, `green`, `pink`],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random())),
  isOverdue: Boolean(Math.round(Math.random())),
  isToday: Boolean(Math.round(Math.random())),
  isRepeating: Boolean(Math.round(Math.random())),
  isTags: Boolean(Math.round(Math.random()))
});

const getAllTasks = (tasks) => {
  return tasks.length;
};

const getCountType = (tasks, filterKey) => {
  return tasks.filter((el) => el[filterKey]).length;
};

export const getFilter = (tasks) => ([
  {
    title: `All`,
    get count() {
      return getAllTasks(tasks);
    },
  },
  {
    title: `Overdue`,
    get count() {
      return getCountType(tasks, this.flagName);
    },
    flagName: `isOverdue`,
  },
  {
    title: `Today`,
    get count() {
      return getCountType(tasks, this.flagName);
    },
    flagName: `isToday`,
  },
  {
    title: `Favorites`,
    get count() {
      return getCountType(tasks, this.flagName);
    },
    flagName: `isFavorites`,
  },
  {
    title: `Repeating`,
    get count() {
      return getCountType(tasks, this.flagName);
    },
    flagName: `isRepeating`,
  },
  {
    title: `Tags`,
    get count() {
      return getCountType(tasks, this.flagName);
    },
    flagName: `isTags`,
  },
  {
    title: `Archive`,
    get count() {
      return getCountType(tasks, this.flagName);
    },
    flagName: `isArchive`,
  }
]);
