import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../generic/resources/error.messages";
import { UserService } from "../services/user.service";
import OperationResult from "../utils/operationResult";
import crypto from "crypto";
import { IUserToken } from "../generic/interfaces/user.interface";
import {
  removeToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../middleware/auth";
import { SuccessMessage } from "../generic/resources/success.messages";
import moment from "moment";
import { User } from "../models/user.model";
import { v4 as uuidv4 } from "uuid";

class UserController {
  /**
   * register user
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async registerUser(
    request: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, name, password, age, telephone } = request.body;
      const user = await UserService.getUserByEmail(email);
      if (user)
        return res
          .status(409)
          .json(OperationResult.failed(409, ErrorMessages.USER_EXIST));

      const payload = {
        email,
        name,
        telephone,
        age,
        password: crypto
          .createHmac("sha256", process.env.PASSWORD_SECRET_KEY)
          .update(password)
          .digest("hex"),
        id: uuidv4(),
        created_at: moment().unix(),
        updated_at: moment().unix(),
      };
      const addedUser = await UserService.createUser(payload as User);

      const userData: IUserToken = {
        id: addedUser.id,
        email: addedUser.email,
        name: addedUser.name,
      };
      const token = signAccessToken(userData);
      const refreshToken = await signRefreshToken(userData);
      return res.status(200).json(
        OperationResult.success({
          user: userData,
          backendTokens: {
            token: token,
            refreshToken: refreshToken,
            expiresIn: new Date().setTime(
              new Date().getTime() +
                1000 * Number(process.env.ACCESS_TOKEN_LIFE)
            ),
          },
        })
      );
    } catch (error) {
      console.log("err>>", error);
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * login user
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async loginUser(request: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;
      const user = await UserService.getUserByEmail(email);
      if (!user)
        return res
          .status(404)
          .json(OperationResult.failed(404, ErrorMessages.USER_DOES_NOT_EXIST));

      const passwordHash = crypto
        .createHmac("sha256", process.env.PASSWORD_SECRET_KEY)
        .update(password)
        .digest("hex");

      if (passwordHash != user.password)
        return res
          .status(401)
          .json(OperationResult.failed(401, ErrorMessages.INCORRECT_PASSWORD));

      const userData: IUserToken = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      const token = signAccessToken(userData);
      const refreshToken = await signRefreshToken(userData);
      return res.status(200).json(
        OperationResult.success({
          user: userData,
          backendTokens: {
            token: token,
            refreshToken: refreshToken,
            expiresIn: new Date().setTime(
              new Date().getTime() +
                1000 * Number(process.env.ACCESS_TOKEN_LIFE)
            ),
          },
        })
      );
    } catch (error) {
      console.log("err>>", error);
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * logout user
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async logoutUser(request: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = request.body;

      if (!refresh_token)
        return res
          .status(403)
          .json(OperationResult.failed(403, ErrorMessages.MISSING_TOKEN));

      const tokenData = await verifyRefreshToken(refresh_token);

      if (!tokenData.status)
        return res
          .status(401)
          .json(OperationResult.failed(401, tokenData.message));

      const removedToken = await removeToken(tokenData.data.id);

      if (!removedToken)
        return res
          .status(500)
          .json(
            OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR)
          );
      return res
        .status(200)
        .json(
          OperationResult.success(tokenData.data.id, SuccessMessage.USER_LOGOUT)
        );
    } catch (error) {
      console.log("err>>", error);
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * generate refresh token
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async generateRefreshToken(
    request: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refresh_token } = request.body;

      if (!refresh_token)
        return res
          .status(403)
          .json(OperationResult.failed(403, ErrorMessages.MISSING_TOKEN));

      const tokenData = await verifyRefreshToken(refresh_token);

      if (!tokenData.status)
        return res
          .status(401)
          .json(OperationResult.failed(401, tokenData.message));

      const userData: IUserToken = {
        id: tokenData.data.id,
        email: tokenData.data.email,
        name: tokenData.data.name,
      };
      const token = signAccessToken(userData);
      const refreshToken = await signRefreshToken(userData);

      return res.status(200).json(
        OperationResult.success({
          user: userData,
          backendTokens: {
            token: token,
            refreshToken: refreshToken,
            expiresIn: new Date().setTime(
              new Date().getTime() +
                1000 * Number(process.env.ACCESS_TOKEN_LIFE)
            ),
          },
        })
      );
    } catch (error) {
      console.log("err>>", error);
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * get user details
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static async getUser(request: Request, res: Response, next: NextFunction) {
    try {
      const { id } = request.user;

      const user = await UserService.getUserById(id);

      return res.status(200).json(OperationResult.success(user));
    } catch (error) {
      console.log("err>>", error);
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }
}

export default UserController;
