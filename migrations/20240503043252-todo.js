"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("todos", {
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
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      todo_list_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "todo_lists",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addIndex("todos", ["todo_list_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("todos");
  },
};
