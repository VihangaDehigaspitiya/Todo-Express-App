import { TodoList } from "../../src/models/todoList.model";
import { User } from "../../src/models/user.model";

export const removeTestUsers = async () => {
  return await User.destroy({
    where: {
      name: "test",
    },
  });
};

export const addTestUser = async (payload: any) => {
  return await User.create(payload);
};

export const removeTestTodoLists = async () => {
  return await TodoList.destroy({
    where: {
      title: "Test",
    },
  });
};

export const addTestTodoList = async (payload: any) => {
  return await TodoList.create(payload);
};
