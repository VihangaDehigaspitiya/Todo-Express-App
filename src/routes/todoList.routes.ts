import TodoListController from "../controllers/todoList.controller";
import { Router } from "express";
import todoListSchema from "../schema/todoList.schema";
import ValidateSchema from "../middleware/validationSchema";
import { checkAuthorization } from "../middleware/auth";

export const todoListApisRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: TodoList
 *     description: Operations related to the todo list
 * /todo-list:
 *   post:
 *     summary: Add todo list
 *     description: Add new todo list
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TodoList
 *     parameters:
 *       - in: body
 *         name: todo list body
 *         description: Add todo list
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             todos:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *         example:
 *           title: test todo list
 *           todos:
 *             - name: todo 1
 *               description: todo 1 description
 *             - name: todo 2
 *               description: todo 2 description
 *     responses:
 *       200:
 *         description: A todo list object.
 */
todoListApisRoutes.post(
  "/",
  checkAuthorization(),
  ValidateSchema.prepare(todoListSchema.todoListSchema),
  TodoListController.createTodoList
);

/**
 * @swagger
 * tags:
 *   - name: TodoList
 *     description: Operations related to the todo list
 * /todo-list/{id}:
 *   put:
 *     summary: Archive todo list
 *     description: Archive todo list
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TodoList
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the todo list.
 *       - in: body
 *         name: todo list body
 *         description: Archive todo list
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             is_archived:
 *               type: boolean
 *     responses:
 *       200:
 *         description: A todo list object.
 */
todoListApisRoutes.put(
  "/:id",
  checkAuthorization(),
  ValidateSchema.prepare(todoListSchema.todoListArchiveSchema),
  TodoListController.archiveTodoList
);

/**
 * @swagger
 * tags:
 *   - name: TodoList
 *     description: Operations related to the todo list
 * /todo-list:
 *   get:
 *     summary: Returns all users todo list
 *     description: Get all todo list
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TodoList
 *     responses:
 *       200:
 *         description: A list of todo lists.
 */
todoListApisRoutes.get(
  "/",
  checkAuthorization(),
  TodoListController.getUserTodoLists
);

/**
 * @swagger
 * tags:
 *   - name: TodoList
 *     description: Operations related to the todo list
 * /todo-list/{id}:
 *   get:
 *     summary: Returns todo list details
 *     description: Get todo list
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TodoList
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the todo list.
 *     responses:
 *       200:
 *         description: A todo list object.
 */
todoListApisRoutes.get(
  "/:id",
  checkAuthorization(),
  TodoListController.getTodoList
);
