import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sequelize from "./clients/sequelize";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { userApisRoutes } from "../src/routes/user.routes";
import { todoListApisRoutes } from "../src/routes/todoList.routes";
import { todoApisRoutes } from "../src/routes/todo.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "Todo API Description",
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
    },
  },
  apis: [path.resolve(__dirname, "./routes/*.ts")], // Path to your API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(cors());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*coverage report*/
app.use("/coverage", express.static("coverage/lcov-report"));

app.use("/user", userApisRoutes);
app.use("/todo-list", todoListApisRoutes);
app.use("/todo", todoApisRoutes);

async () => {
  await sequelize.sync({ force: true });
};

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
