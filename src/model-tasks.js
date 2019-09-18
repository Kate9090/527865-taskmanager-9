export default class ModelTasks {
    constructor(data) {
      this.id = data[`id`];
      this.description = data[`description`] || ``;
      this.dueDate = new Date(data[`due_date`]);
      this.tags = new Set(data[`tags`] || []);
      this.repeatingDays = data[`repeating_days`];
      this.color = data[`color`];
      this.isFavorite = Boolean(data[`is_favorite`]);
      this.isArchive = Boolean(data[`is_archived`]);
    }
  
    static parseTask(data) {
      return new ModelTasks(data);
    }
  
    static parseTasks(data) {
      return data.map(ModelTasks.parseTask);
    }
  
    static toRAW(data) {
      return {
        'id': data.id,
        'description': data.description,
        'due_date': data.dueDate,
        'tags': [...data.tags.values()],
        'repeating_days': data.repeatingDays,
        'color': data.color,
        'is_favorite': data.isFavorite,
        'is_archived': data.isArchive,
      };
    }
  }