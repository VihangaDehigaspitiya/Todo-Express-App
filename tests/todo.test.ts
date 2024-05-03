import request from "supertest";
import app from "../src/index";
import {
  removeTestUsers,
  addTestUser,
  removeTestTodoLists,
  addTestTodoList,
} from "./mock/function";
import redisClient from "../src/clients/redis";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const userPayload = {
  email: "test@abc.com",
  name: "test",
  password: crypto
    .createHmac("sha256", process.env.PASSWORD_SECRET_KEY as string)
    .update("test")
    .digest("hex"),
  age: 10,
  telephone: "0712777777",
  created_at: moment().unix(),
  id: uuidv4(),
};

const todoList = {
  created_at: moment().unix(),
  id: uuidv4(),
  user_id: userPayload.id,
  title: "Test",
};

let tokens: any = null;
let todoId: any = null;

describe("Todo Module", () => {
  beforeAll(async () => {
    await addTestUser(userPayload);
    await addTestTodoList(todoList);

    const response = await request(app).post("/user/login").send({
      email: userPayload.email,
      password: "test",
    });

    if (response && response.status === 200) {
      tokens = response.body.value.backendTokens;
    }
  }, 50000);

  afterAll(async () => {
    await removeTestUsers();
    await removeTestTodoLists();
    redisClient.quit();
  }, 50000);

  it("POST todo/ - Add Todo - Invalid Payload", async () => {
    const newTodo = {
      name: "test",
      description: "",
      todo_list_id: "",
    };

    const response = await request(app)
      .post("/todo")
      .set("Authorization", "Bearer " + tokens?.token)
      .send(newTodo);

    expect(response.status).toBe(422);
  }, 20000);

  it("POST todo/ - Add Todo - Valid Payload", async () => {
    const newTodo = {
      name: "Test",
      description: "test",
      todo_list_id: todoList.id,
    };

    const response = await request(app)
      .post("/todo")
      .set("Authorization", "Bearer " + tokens?.token)
      .send(newTodo);

    expect(response.status).toBe(200);
    expect(response.body.value).toHaveProperty("id");
    todoId = response.body.value.id;
  }, 20000);

  it("GET todo/:id - Get Todos - Valid", async () => {
    const response = await request(app)
      .get(`/todo/${todoList.id}`)
      .set("Authorization", "Bearer " + tokens?.token)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.value.length).toBe(1);
  }, 20000);

  it("PUT todo/:id - Update Todo - Invalid Payload", async () => {
    const todo = {
      name: "test",
      description: "",
    };

    const response = await request(app)
      .put(`/todo/${todoId}`)
      .set("Authorization", "Bearer " + tokens?.token)
      .send(todo);

    expect(response.status).toBe(422);
  }, 20000);

  it("PUT todo/:id - Update Todo - Valid Payload", async () => {
    const todo = {
      name: "Test",
      description: "Test 123",
    };

    const response = await request(app)
      .put(`/todo/${todoId}`)
      .set("Authorization", "Bearer " + tokens?.token)
      .send(todo);

    expect(response.status).toBe(200);
  }, 20000);

  it("DELETE todo/:id - Delete Todo - Valid", async () => {
    const response = await request(app)
      .delete(`/todo/${todoId}`)
      .set("Authorization", "Bearer " + tokens?.token)
      .send();

    expect(response.status).toBe(200);
  }, 20000);
});
