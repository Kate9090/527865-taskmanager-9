const randomCount = (limit) => Math.floor(Math.random() * limit);

const randomBoolean = () => Boolean(Math.round(Math.random()));

export const createTask = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ][randomCount(3)],
  dueDate: Date.now() + 1 + randomCount(7) * 24 * 60 * 60 * 1000,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': randomBoolean(),
    'th': false,
    'fr': false,
    'sa': false,
    'su': false
  },
  tags: new Set([`homework`, `theory`, `practice`, `intensive`, `keks`]),
  colorArray: [`black`, `yellow`, `blue`, `green`, `pink`],
  color: [`black`, `yellow`, `blue`, `green`, `pink`][randomCount(5)],
  startCount: randomCount(3),
  endCount: 1 + randomCount(2),
  isFavorite: randomBoolean(),
  isArchive: randomBoolean(),
  isOverdue() {
    if(dueDate < Date.now()) {
      return true
    }
    return false
  },
  isToday() {
    if(dueDate > Date.now()) {
      return true
    }
    return false
  },
  isRepeating: randomBoolean(),
  isTags: randomBoolean(),
});

const calculateAllTasks = (tasks) => {
  return tasks.length;
};

const getCount = (tasks, flagName) => {
  return tasks.filter((task) => task[flagName]).length;
};

export const createFilter = (tasks) => ([
  {
    title: `All`,
    getValue() {
      return calculateAllTasks(tasks);
    },
    flagName: `All`,
  },
  {
    title: `Overdue`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `isOverdue`,
  },
  {
    title: `Today`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `isToday`,
  },
  {
    title: `Favorites`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `isFavorites`,
  },
  {
    title: `Repeating`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `isRepeating`,
  },
  {
    title: `Tags`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `isTags`,
  },
  {
    title: `Archive`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `isArchive`,
  }
]);
