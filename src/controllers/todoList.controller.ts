import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../generic/resources/error.messages";
import OperationResult from "../utils/operationResult";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { TodoListService } from "../services/todoList.service";
import { TodoList } from "../models/todoList.model";
import { Todo } from "../models/todo.model";
import { ITodo } from "../generic/interfaces/todo.interface";
import { TodoService } from "../services/todo.service";
import { SuccessMessage } from "../generic/resources/success.messages";

class TodoListController {
  /**
   * create todo list
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async createTodoList(
    request: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, todos } = request.body;
      const { id } = request.user;
      const todoList = await TodoListService.createTodoList({
        id: uuidv4(),
        created_at: moment().unix(),
        updated_at: moment().unix(),
        title,
        user_id: id,
      } as TodoList);

      let todoPayload = todos.map((todo: ITodo) => {
        return {
          id: uuidv4(),
          todo_list_id: todoList.id,
          name: todo.name,
          description: todo.name,
          created_at: moment().unix(),
          updated_at: moment().unix(),
        } as Todo;
      });

      await TodoService.createTodo(todoPayload);

      return res
        .status(200)
        .json(
          OperationResult.success(todoList, SuccessMessage.TODO_LIST_CREATED)
        );
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * get users todo lists
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async getUserTodoLists(
    request: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.user;
      const todoLists = await TodoListService.getUserTodoLists(id);
      return res.status(200).json(OperationResult.success(todoLists));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * get todo list details
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async getTodoList(
    request: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const todoList = await TodoListService.getTodoListById(id);
      return res.status(200).json(OperationResult.success(todoList));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * archive todo list
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async archiveTodoList(
    request: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const { is_archived } = request.body;
      const todoList = await TodoListService.archiveTodoList(id, is_archived);
      return res
        .status(200)
        .json(
          OperationResult.success(todoList, SuccessMessage.TODO_LIST_UPDATED)
        );
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }
}

export default TodoListController;
