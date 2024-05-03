import { Sequelize } from "sequelize-typescript";
import * as config from "../../../config/config.json";
import { Dialect } from "sequelize";
import { User } from "../../models/user.model";
import { TodoList } from "../../models/todoList.model";
import { Todo } from "../../models/todo.model";

const env = "development";
const dbConfig = config[env];

const sequelize = new Sequelize({
  database: dbConfig.database,
  dialect: dbConfig.dialect as Dialect,
  username: dbConfig.username,
  host: dbConfig.host,
  password: dbConfig.password,
  port: 3306,
  models: [User, TodoList, Todo],
  // modelMatch: (filename, member) => {
  //   return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  // },
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
sequelize.addModels([User]);

testConnection();

export default sequelize;
