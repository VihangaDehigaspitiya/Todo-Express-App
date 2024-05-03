"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("todo_lists", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      is_archived: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default: false,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addIndex("todo_lists", ["user_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("todo_lists");
  },
};
