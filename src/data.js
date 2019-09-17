const randomCount = (limit) => Math.floor(Math.random() * limit);
const randomBoolean = () => Boolean(Math.round(Math.random()));
const randomSign = () => {
  if (randomBoolean()) {
    return 1;
  }
  return -1;
};
const startCount = randomCount(3);
const endCount = startCount + 1 + randomCount(3);

export const createTask = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ][randomCount(3)],
  dueDate: new Date(Date.now() + 1 + randomSign() * randomCount(7) * 24 * 60 * 60 * 1000),
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': randomBoolean(),
    'th': false,
    'fr': false,
    'sa': false,
    'su': false
  },
  tags: new Set([`homework`, `theory`, `practice`, `intensive`, `keks`].slice(startCount, endCount)),
  color: [`black`, `yellow`, `blue`, `green`, `pink`][randomCount(5)],
  isFavorites: randomBoolean(),
  isArchive: randomBoolean(),
  isOverdue() {
    if (new Date(this.dueDate) < Date.now()) {
      return true;
    }
    return false;
  },
  isToday() {
    if (new Date(this.dueDate) > Date.now()) {
      return true;
    }
    return false;
  },
  isRepeating: randomBoolean(),
  isTags: randomBoolean(),
});

const calculateAllTasks = (tasks) => {
  return tasks.length;
};

const getCount = (tasks, flagName) => {
  return tasks.filter((task) => {
    if (typeof task[flagName] === `boolean`) {
      return task[flagName];
    }
    return task[flagName]();
  }).length;
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
