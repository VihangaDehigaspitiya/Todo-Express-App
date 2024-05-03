import TodoController from "../controllers/todo.controller";
import { Router } from "express";
import todoSchema from "../schema/todo.schema";
import ValidateSchema from "../middleware/validationSchema";
import { checkAuthorization } from "../middleware/auth";

export const todoApisRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Todo
 *     description: Operations related to the todo
 * /todo:
 *   post:
 *     summary: Add todo
 *     description: Add new todo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Todo
 *     parameters:
 *       - in: body
 *         name: todo body
 *         description: Add todo
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             todo_list_id:
 *               type: string
 *         example:
 *           name: test todo
 *           description: test todo description
 *           todo_list_id: todo_list_id
 *     responses:
 *       200:
 *         description: A todo object.
 */
todoApisRoutes.post(
  "/",
  checkAuthorization(),
  ValidateSchema.prepare(todoSchema.addTodoSchema),
  TodoController.createTodo
);

/**
 * @swagger
 * tags:
 *   - name: Todo
 *     description: Operations related to the todo
 * /todo/{id}:
 *   delete:
 *     summary: Remove todo
 *     description: Remove todo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the todo.
 *     responses:
 *       200:
 *         description: A todo id.
 */
todoApisRoutes.delete("/:id", checkAuthorization(), TodoController.removeTodo);

/**
 * @swagger
 * tags:
 *   - name: Todo
 *     description: Operations related to the todo
 * /todo/{id}:
 *   put:
 *     summary: Update todo
 *     description: Update todo details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the todo.
 *       - in: body
 *         name: todo body
 *         description: Update todo
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *         example:
 *           name: test todo
 *           description: test todo description
 *     responses:
 *       200:
 *         description: A todo id.
 */
todoApisRoutes.put(
  "/:id",
  checkAuthorization(),
  ValidateSchema.prepare(todoSchema.updateTodoSchema),
  TodoController.updateTodo
);

/**
 * @swagger
 * tags:
 *   - name: Todo
 *     description: Operations related to the todo
 * /todo/{id}:
 *   get:
 *     summary: Get todos
 *     description: Get all todos related to the todo list
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the todo list.
 *     responses:
 *       200:
 *         description: A todo list.
 */
todoApisRoutes.get("/:id", checkAuthorization(), TodoController.getTodos);
