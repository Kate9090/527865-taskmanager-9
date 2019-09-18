const getCount = (tasks, flagName) => {
  return tasks.filter((task) => {
      return task[flagName];
  }).length;
};

export const createFilter = (tasks) => ([
  {
    title: `All`,
    getValue() {
      return tasks.length;
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
    flagName: `isFavorite`,
  },
  {
    title: `Repeating`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `repeatingDays`,
  },
  {
    title: `Tags`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `tags`,
  },
  {
    title: `Archive`,
    getValue() {
      return getCount(tasks, this.flagName);
    },
    flagName: `isArchive`,
  }
]);
