import UserController from "../controllers/user.controller";
import { Router } from "express";
import userSchema from "../schema/user.schema";
import ValidateSchema from "../middleware/validationSchema";
import { checkAuthorization } from "../middleware/auth";

export const userApisRoutes = Router();
/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to the user
 * /user:
 *   post:
 *     summary: User register
 *     description: Register new user
 *     tags:
 *       - User
 *     parameters:
 *       - in: body
 *         name: user body
 *         description: Register user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             name:
 *               type: string
 *             telephone:
 *               type: string
 *             age:
 *               type: number
 *
 *         example:
 *           email: test@example.com
 *           password: 12345
 *           name: test user
 *           telephone: 0741231231
 *           age: 20
 *
 *     responses:
 *       200:
 *         description: An user object.
 */
userApisRoutes.post(
  "/",
  ValidateSchema.prepare(userSchema.registerSchema),
  UserController.registerUser
);

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to the user
 * /user/login:
 *   post:
 *     summary: User login
 *     description: Login user
 *     tags:
 *       - User
 *     parameters:
 *       - in: body
 *         name: credentials body
 *         description: Login user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *         example:
 *           email: test@example.com
 *           password: 12345
 *
 *     responses:
 *       200:
 *         description: An user object with tokens.
 */
userApisRoutes.post(
  "/login",
  ValidateSchema.prepare(userSchema.loginSchema),
  UserController.loginUser
);

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to the user
 * /user/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: refreshToken body
 *         description: Logout user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             refreshToken:
 *               type: string
 *         example:
 *           refreshToken: test
 *
 *     responses:
 *       200:
 *         description: An user id.
 */
userApisRoutes.post(
  "/logout",
  checkAuthorization(),
  ValidateSchema.prepare(userSchema.refreshTokenSchema),
  UserController.logoutUser
);

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to the user
 * /user/refresh-token:
 *   post:
 *     summary: Generate tokens
 *     description: Generate tokens
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: refreshToken body
 *         description: Generate tokens
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             refreshToken:
 *               type: string
 *         example:
 *           refreshToken: test
 *
 *     responses:
 *       200:
 *         description: An user object with tokens.
 */
userApisRoutes.post(
  "/refresh-token",
  ValidateSchema.prepare(userSchema.refreshTokenSchema),
  UserController.generateRefreshToken
);

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to the user
 * /user/me:
 *   get:
 *     summary: Get user
 *     description: Get user details
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: An user object.
 */
userApisRoutes.get("/me", checkAuthorization(), UserController.getUser);
