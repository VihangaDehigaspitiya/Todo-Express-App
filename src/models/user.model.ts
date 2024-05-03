import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { TodoList } from "./todoList.model";

@Table({ tableName: "users", timestamps: false })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.INTEGER,
  })
  updated_at?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_at?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  telephone?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age?: number;

  @HasMany(() => TodoList)
  todo_lists: TodoList[];
}
