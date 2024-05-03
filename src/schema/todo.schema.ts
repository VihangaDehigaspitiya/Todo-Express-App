import Joi from "joi";

const addTodoSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  todo_list_id: Joi.string().required(),
});

const updateTodoSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

export default {
  addTodoSchema,
  updateTodoSchema,
};
