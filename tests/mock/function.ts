import { TodoList } from "../../src/models/todoList.model";
import { User } from "../../src/models/user.model";

/**
 * Remove test users
 * @returns 
 */
export const removeTestUsers = async () => {
  return await User.destroy({
    where: {
      name: "test",
    },
  });
};

/**
 * Add test users
 * @param payload 
 * @returns 
 */
export const addTestUser = async (payload: any) => {
  return await User.create(payload);
};

/**
 * Remove todo lists
 * @returns 
 */
export const removeTestTodoLists = async () => {
  return await TodoList.destroy({
    where: {
      title: "Test",
    },
  });
};

/**
 * Add todo lists
 * @param payload 
 * @returns 
 */
export const addTestTodoList = async (payload: any) => {
  return await TodoList.create(payload);
};
