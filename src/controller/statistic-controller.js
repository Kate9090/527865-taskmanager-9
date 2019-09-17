import {Statistic} from '../components/statistic';
import {Position, render} from '../utils.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const colorsHex = {
  pink: `#ff3cb9`,
  yellow: `#ffe125`,
  blue: `#0c5cdd`,
  black: `#000000`,
  green: `#31b55c`
};

export default class StatisticsController {
  constructor(container) {
    this._container = container;
    this._statistics = new Statistic();
    this._tasks = [];
    this._start = ``;
    this._end = ``;
    this._field = this._statistics.getElement().querySelector(`.statistic__period-input`);
    this._colorsChart = {};
    this._daysChart = {};
    this._tagsChart = {};

    this.create();
  }

  create() {
    this._start = moment().startOf(`isoWeek`);
    this._end = moment().endOf(`isoWeek`);

    flatpickr(this._field, {
      mode: `range`,
      dateFormat: `d M`,
      defaultDate: [this._start.format(`DD MMM`), this._end.format(`DD MMM`)],
      onChange: (selectedDates) => {
        this._start = selectedDates[0];
        this._end = selectedDates[1];
        this._chartDaysInit();
      }
    });

    render(this._container, this._statistics.getElement(), Position.BEFOREEND);
  }

  show(tasks) {
    this._tasks = tasks.filter(({isArchive}) => isArchive);
    this._statistics.getElement().classList.remove(`visually-hidden`);
    this._chartDaysInit();
    this._chartTagsInit();
    this._chartColorsInit();
  }

  hide() {
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  _chartColorsInit() {
    const colorsCtx = this._statistics.getElement().querySelector(`.statistic__colors`);

    const taskColors = this._tasks.map((task) => task.color);

    const byColorTasks = taskColors.reduce((acc, currentValue) => {
      const index = acc.findIndex(({color}) => color === currentValue);
      if (index !== -1) {
        acc[index].count++;
      } else {
        acc.push({
          color: currentValue,
          count: 1,
        });
      }
      return acc;
    }, []);

    const labels = byColorTasks.map(({color}) => `#${color}`);
    const counts = byColorTasks.map(({count}) => count);
    const colors = byColorTasks.map(({color}) => colorsHex[color]);

    this._colorsChart = new Chart(colorsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: colors
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: COLORS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
  }

  _chartDaysInit() {
    const daysCtx = this._statistics.getElement().querySelector(`.statistic__days`);

    const taskDays = this._tasks.map((task) => task.dueDate).sort((a, b) => a - b);
    const byDayTasks = taskDays.reduce((acc, currentValue) => {
      const index = acc.findIndex(({date}) => moment(date).isSame(moment(currentValue), `day`));
      if (index !== -1) {
        acc[index].count++;
      } else {
        acc.push({
          date: moment(currentValue).format(),
          count: 1
        });
      }
      return acc;
    }, []);

    const chartTasks = byDayTasks.filter(({date}) => moment(date).isSameOrAfter(moment(this._start), `day`) && moment(date).isSameOrBefore(moment(this._end), `day`));
    const labels = chartTasks.map(({date}) => moment(date).format(`DD MMM`));
    const counts = chartTasks.map(({count}) => count);

    this._daysChart = new Chart(daysCtx, {
      plugins: [ChartDataLabels],
      type: `line`,
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: `transparent`,
          borderColor: `#000000`,
          borderWidth: 1,
          lineTension: 0,
          pointRadius: 8,
          pointHoverRadius: 8,
          pointBackgroundColor: `#000000`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 8
            },
            color: `#ffffff`
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              display: false
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 0
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  _chartTagsInit() {
    const tagsCtx = this._statistics.getElement().querySelector(`.statistic__tags`);

    const taskTags = this._tasks.map((task) => Array.from(task.tags));
    const allTags = taskTags.reduce((acc, tags) => {
      acc.push(...tags);
      return acc;
    }, []);
    const byTagTasks = allTags.reduce((acc, currentValue) => {
      const index = acc.findIndex(({tag}) => tag === currentValue);
      if (index !== -1) {
        acc[index].count++;
      } else {
        acc.push({
          tag: currentValue,
          count: 1,
          color: `#${(0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)}`
        });
      }
      return acc;
    }, []);

    const labels = byTagTasks.map(({tag}) => `#${tag}`);
    const counts = byTagTasks.map(({count}) => count);
    const colors = byTagTasks.map(({color}) => color);

    this._tagsChart = new Chart(tagsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: colors
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
  }
}
