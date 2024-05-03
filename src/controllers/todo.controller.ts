import { NextFunction, Request, Response } from "express";
import OperationResult from "../utils/operationResult";
import { ErrorMessages } from "../generic/resources/error.messages";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { Todo } from "../models/todo.model";
import { TodoService } from "../services/todo.service";
import { SuccessMessage } from "../generic/resources/success.messages";

class TodoController {
  /**
   * create todo
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async createTodo(request: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, todo_list_id } = request.body;

      let payload = {
        name,
        description,
        id: uuidv4(),
        todo_list_id,
        created_at: moment().unix(),
        updated_at: moment().unix(),
      } as Todo;

      await TodoService.createTodo([payload]);
      return res
        .status(200)
        .json(OperationResult.success(payload, SuccessMessage.TODO_ADDED));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * remove todo by id
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async removeTodo(request: Request, res: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      await TodoService.removeTodo(id);
      return res
        .status(200)
        .json(OperationResult.success(id, SuccessMessage.TODO_REMOVED));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * update existing todo
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async updateTodo(request: Request, res: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const { name, description } = request.body;

      await TodoService.updateTodo(
        {
          name,
          description,
        } as Todo,
        id
      );
      return res
        .status(200)
        .json(OperationResult.success(id, SuccessMessage.TODO_UPDATED));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * get todo list
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async getTodos(request: Request, res: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const todoList = await TodoService.getTodos(id);
      return res.status(200).json(OperationResult.success(todoList));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }
}

export default TodoController;
