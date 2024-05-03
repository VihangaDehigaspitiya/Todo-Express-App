import { Todo } from "../models/todo.model";
import { TodoList } from "../models/todoList.model";

export class TodoListService {
  /**
   * create a new todo list
   * @param user
   * @returns
   */
  static async createTodoList(todoList: TodoList): Promise<TodoList> {
    return await TodoList.create(todoList);
  }

  /**
   * get todo list by Id
   * @param id
   * @returns
   */
  static async getTodoListById(id: string): Promise<TodoList | null> {
    return await TodoList.findOne({
      where: {
        id: id,
        is_archived: false,
      },
      include: [
        {
          model: Todo,
        },
      ],
    });
  }

  /**
   * get users todo lists
   * @param userId
   * @returns
   */
  static async getUserTodoLists(userId: string): Promise<TodoList[]> {
    return await TodoList.findAll({
      where: {
        user_id: userId,
      },
    });
  }

  /**
   * archive todo list
   * @param id
   * @param is_archived
   * @returns
   */
  static async archiveTodoList(
    id: string,
    is_archived: boolean
  ): Promise<TodoList> {
    let todoList = await this.getTodoListById(id);
    if (!todoList) return;
    todoList.is_archived = is_archived;
    return await todoList.save();
  }
}
