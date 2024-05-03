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

let tokens: any = null;
let todoListId: any = null;

describe("Todo List Module", () => {
  beforeAll(async () => {
    await addTestUser(userPayload);

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

  it("POST todo-list/ - Add Todo List - Invalid Payload", async () => {
    const newTodoList = {
      title: "",
    };

    const response = await request(app)
      .post("/todo-list")
      .set("Authorization", "Bearer " + tokens?.token)
      .send(newTodoList);

    expect(response.status).toBe(422);
  }, 20000);

  it("POST todo-list/ - Add Todo List - Valid Payload", async () => {
    const newTodoList = {
      title: "Test",
      todos: [
        {
          name: "test 1",
          description: "test 1 description",
        },
      ],
    };

    const response = await request(app)
      .post("/todo-list")
      .set("Authorization", "Bearer " + tokens?.token)
      .send(newTodoList);

    expect(response.status).toBe(200);
    expect(response.body.value).toHaveProperty("id");
  }, 20000);

  it("GET todo-list/ - Get User Todo List - Valid", async () => {
    const response = await request(app)
      .get("/todo-list")
      .set("Authorization", "Bearer " + tokens?.token)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.value.length).toBe(1);
  }, 20000);

  it("GET todo-list/:id - Get Todo List - Valid", async () => {
    let todoList = await addTestTodoList({
      id: uuidv4(),
      title: "Test",
      user_id: userPayload.id,
      created_at: moment().unix(),
    });

    todoListId = todoList.id;

    const response = await request(app)
      .get(`/todo-list/${todoList.id}`)
      .set("Authorization", "Bearer " + tokens?.token)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.value).toHaveProperty("id");
  }, 20000);

  it("PUT todo-list/:id - Archive Todo List - Invalid", async () => {
    let todoListPayload = {
      is_archived: "",
    };

    const response = await request(app)
      .put(`/todo-list/${todoListId}`)
      .set("Authorization", "Bearer " + tokens?.token)
      .send(todoListPayload);

    expect(response.status).toBe(422);
  }, 20000);

  it("PUT todo-list/:id - Archive Todo List - Valid", async () => {
    let todoListPayload = {
      is_archived: true,
    };

    const response = await request(app)
      .put(`/todo-list/${todoListId}`)
      .set("Authorization", "Bearer " + tokens?.token)
      .send(todoListPayload);

    expect(response.status).toBe(200);
    expect(response.body.value).toHaveProperty("id");
  }, 20000);
});
