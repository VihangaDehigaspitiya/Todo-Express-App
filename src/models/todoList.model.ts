import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  HasMany,
  ForeignKey,
} from "sequelize-typescript";
import { Todo } from "./todo.model";
import { User } from "./user.model";

@Table({ tableName: "todo_lists", timestamps: false })
export class TodoList extends Model<TodoList> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
  })
  title?: string;

  @Column({
    type: DataType.INTEGER,
  })
  updated_at?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_at?: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_archived?: boolean;

  @HasMany(() => Todo)
  todos: Todo[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id?: string;
}
