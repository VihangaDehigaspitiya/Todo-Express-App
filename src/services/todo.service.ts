import { Todo } from "../models/todo.model";

export class TodoService {
  /**
   * add todos to todo list
   * @param user
   * @returns
   */
  static async createTodo(todoList: Todo[]): Promise<Todo[]> {
    return await Todo.bulkCreate(todoList);
  }

  /**
   * remove todo
   * @param id
   * @returns
   */
  static async removeTodo(id: string): Promise<number> {
    return await Todo.destroy({
      where: {
        id: id,
      },
    });
  }

  /**
   * update todo
   * @param todo
   * @param id
   * @returns
   */
  static async updateTodo(todo: Todo, id: string): Promise<number[]> {
    return await Todo.update(todo, {
      where: {
        id: id,
      },
    });
  }

  /**
   * get todos
   * @param todo
   * @param id
   * @returns
   */
  static async getTodos(id: string): Promise<Todo[]> {
    return await Todo.findAll({
      where: {
        todo_list_id: id,
      },
    });
  }
}
