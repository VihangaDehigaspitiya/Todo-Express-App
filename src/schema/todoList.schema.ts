import Joi from "joi";

const todoObjectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

const todoListSchema = Joi.object({
  todos: Joi.array().items(todoObjectSchema).min(1).required(),
  title: Joi.string().required(),
});

const todoListArchiveSchema = Joi.object({
  is_archived: Joi.boolean().required(),
});

export default {
  todoObjectSchema,
  todoListSchema,
  todoListArchiveSchema,
};
