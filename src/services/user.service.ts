import { User } from "../models/user.model";

export class UserService {
  /**
   * create a new user
   * @param user
   * @returns
   */
  static async createUser(user: User): Promise<User> {
    return await User.create(user);
  }

  /**
   * get user by E-mail
   * @param email
   * @returns
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  /**
   * get user by Id
   * @param id
   * @returns
   */
  static async getUserById(id: string): Promise<User | null> {
    return await User.findOne({
      attributes: ["id", "name", "email", "telephone"],
      where: {
        id: id,
      },
    });
  }
}
