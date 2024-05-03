import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { TodoList } from "./todoList.model";

@Table({ tableName: "todos", timestamps: false })
export class Todo extends Model<Todo> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description?: string;

  @Column({
    type: DataType.INTEGER,
  })
  updated_at?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_at?: number;

  @ForeignKey(() => TodoList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  todo_list_id?: string;
}
