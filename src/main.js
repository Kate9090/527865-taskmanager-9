import BoardController from './controller';
import {createTask, createFilter} from './data';

const TasksCount = {
  MAX: 20,
  LOAD: 8,
  PARTIALLY_CARDS_COUNT: 8
};
const allTasks = [...Array(TasksCount.MAX)].map(() => createTask());

const mainContainer = document.querySelector(`.main`);
const taskMocks = new Array(TasksCount.LOAD).fill(``).map(createTask);
const filterMocks = createFilter(allTasks);

const boardController = new BoardController(mainContainer, taskMocks);
boardController._init(taskMocks, filterMocks, TasksCount.LOAD, TasksCount.PARTIALLY_CARDS_COUNT, TasksCount.MAX);
